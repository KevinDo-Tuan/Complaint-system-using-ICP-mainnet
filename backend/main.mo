import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";

import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();
  include MixinStorage(storage);

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    apartmentNumber : Text;
    building : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public type ComplaintStatus = {
    #pending;
    #resolved;
  };

  public type ReportStatus = {
    #normal;
    #reported;
  };

  public type StatusHistory = {
    status : ComplaintStatus;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  public type ReportHistory = {
    status : ReportStatus;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  public type Complaint = {
    id : Text;
    submitter : Principal;
    location : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    status : ComplaintStatus;
    reportStatus : ReportStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    statusHistory : [StatusHistory];
    reportHistory : [ReportHistory];
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var complaints = textMap.empty<Complaint>();

  public shared ({ caller }) func submitComplaint(location : Text, description : Text, photo : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Chỉ cư dân mới có thể đăng khiếu nại");
    };

    let id = Text.concat("complaint-", debug_show (Time.now()));
    let timestamp = Time.now();

    let newComplaint : Complaint = {
      id;
      submitter = caller;
      location;
      description;
      photo;
      status = #pending;
      reportStatus = #normal;
      createdAt = timestamp;
      updatedAt = timestamp;
      statusHistory = [
        {
          status = #pending;
          timestamp;
          updatedBy = caller;
        },
      ];
      reportHistory = [
        {
          status = #normal;
          timestamp;
          updatedBy = caller;
        },
      ];
    };

    complaints := textMap.put(complaints, id, newComplaint);
    id;
  };

  public query func getAllComplaints() : async [Complaint] {
    var complaintsArray = Iter.toArray(textMap.vals(complaints));
    Array.sort(
      complaintsArray,
      func(a : Complaint, b : Complaint) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) { #less } else if (a.createdAt < b.createdAt) {
          #greater;
        } else { #equal };
      },
    );
  };

  public shared ({ caller }) func updateComplaintStatus(complaintId : Text, isResolved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Chỉ quản trị viên mới có thể cập nhật trạng thái khiếu nại");
    };

    switch (textMap.get(complaints, complaintId)) {
      case (null) { Debug.trap("Không tìm thấy khiếu nại") };
      case (?complaint) {
        let timestamp = Time.now();
        let newStatus = if (isResolved) { #resolved } else { #pending };

        let updatedComplaint : Complaint = {
          id = complaint.id;
          submitter = complaint.submitter;
          location = complaint.location;
          description = complaint.description;
          photo = complaint.photo;
          status = newStatus;
          reportStatus = complaint.reportStatus;
          createdAt = complaint.createdAt;
          updatedAt = timestamp;
          statusHistory = Array.append(
            complaint.statusHistory,
            [
              {
                status = newStatus;
                timestamp;
                updatedBy = caller;
              },
            ],
          );
          reportHistory = complaint.reportHistory;
        };

        complaints := textMap.put(complaints, complaintId, updatedComplaint);
      };
    };
  };

  public shared ({ caller }) func reportComplaint(complaintId : Text, isReported : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Chỉ quản trị viên mới có thể báo cáo khiếu nại");
    };

    switch (textMap.get(complaints, complaintId)) {
      case (null) { Debug.trap("Không tìm thấy khiếu nại") };
      case (?complaint) {
        let timestamp = Time.now();
        let newReportStatus = if (isReported) { #reported } else { #normal };

        let updatedComplaint : Complaint = {
          id = complaint.id;
          submitter = complaint.submitter;
          location = complaint.location;
          description = complaint.description;
          photo = complaint.photo;
          status = complaint.status;
          reportStatus = newReportStatus;
          createdAt = complaint.createdAt;
          updatedAt = timestamp;
          statusHistory = complaint.statusHistory;
          reportHistory = Array.append(
            complaint.reportHistory,
            [
              {
                status = newReportStatus;
                timestamp;
                updatedBy = caller;
              },
            ],
          );
        };

        complaints := textMap.put(complaints, complaintId, updatedComplaint);
      };
    };
  };

  public query func getComplaintById(complaintId : Text) : async ?Complaint {
    textMap.get(complaints, complaintId);
  };

  public query func getComplaintsByStatus(status : ComplaintStatus) : async [Complaint] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(complaints),
        func(complaint : Complaint) : Bool {
          complaint.status == status;
        },
      )
    );
  };

  public query func getReportedComplaints() : async [Complaint] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(complaints),
        func(complaint : Complaint) : Bool {
          complaint.reportStatus == #reported;
        },
      )
    );
  };
};
