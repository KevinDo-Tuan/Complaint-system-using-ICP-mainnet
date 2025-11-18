import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Storage "blob-storage/Storage";

module {
  type OldComplaintStatus = {
    #pending;
    #resolved;
  };

  type OldStatusHistory = {
    status : OldComplaintStatus;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  type OldComplaint = {
    id : Text;
    submitter : Principal;
    location : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    status : OldComplaintStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    statusHistory : [OldStatusHistory];
  };

  type OldActor = {
    complaints : OrderedMap.Map<Text, OldComplaint>;
  };

  type NewComplaintStatus = {
    #pending;
    #resolved;
  };

  type NewReportStatus = {
    #normal;
    #reported;
  };

  type NewStatusHistory = {
    status : NewComplaintStatus;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  type NewReportHistory = {
    status : NewReportStatus;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  type NewComplaint = {
    id : Text;
    submitter : Principal;
    location : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    status : NewComplaintStatus;
    reportStatus : NewReportStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    statusHistory : [NewStatusHistory];
    reportHistory : [NewReportHistory];
  };

  type NewActor = {
    complaints : OrderedMap.Map<Text, NewComplaint>;
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    let complaints = textMap.map<OldComplaint, NewComplaint>(
      old.complaints,
      func(_id, oldComplaint) {
        {
          id = oldComplaint.id;
          submitter = oldComplaint.submitter;
          location = oldComplaint.location;
          description = oldComplaint.description;
          photo = oldComplaint.photo;
          status = oldComplaint.status;
          reportStatus = #normal;
          createdAt = oldComplaint.createdAt;
          updatedAt = oldComplaint.updatedAt;
          statusHistory = oldComplaint.statusHistory;
          reportHistory = [
            {
              status = #normal;
              timestamp = oldComplaint.createdAt;
              updatedBy = oldComplaint.submitter;
            },
          ];
        };
      },
    );
    { complaints };
  };
};
