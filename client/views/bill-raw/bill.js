var emptyBill = {
  sum: undefined,
  payer: { userId: Meteor.userId()},
  shares: [
    {
      userId: Meteor.userId()
    }
  ]
};

Session.setDefault('bill', emptyBill);

Template.billRaw.helpers({
  sumSpent: function() {
    var bill = Session.get('bill');
    return bill.sum;
  },
  friends: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
  },
  isFriendSelected: function() {
    var bill = Session.get('bill');
    return _.findWhere( bill.shares, {userId: this._id} );
  },
  myShare: function() {
    var myShare = getAShare(Session.get('bill'), Meteor.userId());
    return myShare.sum ? myShare.sum : undefined;
  },
  friendShare: function() {
    var friendShare = getAShare(Session.get('bill'), this._id);
    return friendShare.sum ? friendShare.sum : undefined;
  }
});

Template.billRaw.events({
  'input [sum-spent-input]': function(event, tpl) {
    var bill = Session.get('bill');
    bill.sum = event.target.value;
    recalculateShares(bill);
    Session.set('bill', bill);
  },
  'click [friend-item]': function(event, tpl) {
    var bill = Session.get('bill');

    if (_.findWhere( bill.shares, {userId: this._id} )) {
      // remove clicked friend from the shares
      bill.shares = _.without( bill.shares, _.findWhere( bill.shares, {userId: this._id} ) );
    } else {
      // add clicked friend to the shares
      bill.shares.push({ userId: this._id});
    }
    recalculateShares(bill);
    Session.set('bill', bill);
  },
  'click [save-bill-btn]': function(event, tpl) {
    var bill = Session.get('bill');
    bill.payer.userName = Meteor.users.findOne({_id: bill.payer.userId}).profile.name;
    _.each(bill.shares, function(element, index, list) {
      element.userName = Meteor.users.findOne({_id: element.userId}).profile.name;
    })
    Bills.insert(bill);
    Session.set('bill', emptyBill);
  }
});

function recalculateShares(bill) {
  _.each(bill.shares, function(element, index, list) {
    element.sum = bill.sum / list.length;
  });
}

function getAShare(bill, personId) {
  return _.findWhere(bill.shares, {userId: personId});
}
