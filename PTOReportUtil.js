var PTOReportUtil = Class.create();
PTOReportUtil.prototype = {
    initialize: function () {

    },

    runCalculations: function (usrRec) {

		//****************Sick calculation***********

		var sickAllowed = parseFloat(usrRec.u_sick_allowed);
		var sickUsed = parseFloat(usrRec.u_sick_used);
		var newSickUsed = this.updateSick(usrRec.sys_id, sickUsed);
		usrRec.u_sick_used = newSickUsed;
		usrRec.u_sick_remaining = sickAllowed - newSickUsed;

		//**************Vacation calculation*********

		var vacationAllowed = parseFloat(usrRec.u_vacation_allowed);
		var vacationUsed = parseFloat(usrRec.u_vacation_used);
		var newVacationUsed = this.updateVacation(usrRec.sys_id, vacationUsed);
		usrRec.u_vacation_used = newVacationUsed;
		usrRec.u_vacation_remaining = vacationAllowed - newVacationUsed;

		usrRec.update();
    },

    updateSick: function (usr, sickUsed) {
		var gr = new GlideRecord('u_tctimeoff');
		gr.addQuery('u_user', usr);
		var enc = 'u_time_card.u_dateONThis year@javascript:gs.beginningOfThisYear()@javascript:gs.endOfThisYear()';
		gr.addEncodedQuery(enc);
		gr.addQuery('u_category', 'Sick');
		gr.addNotNullQuery('u_time_card');
		gr.query();
		var hours = 0;

		while (gr.next()) {
			sickUsed = 0;
			hours += gr.u_time;
			gs.log('Sick hours += ' + hours, '$$$BGM');
		}
		sickUsed += hours;
		return sickUsed;
	},

	updateVacation: function (usr, vacationUsed) {
		var gr = new GlideRecord('u_tctimeoff');
		gr.addQuery('u_user', usr);
		var enc = 'u_time_card.u_dateONThis year@javascript:gs.beginningOfThisYear()@javascript:gs.endOfThisYear()';
		gr.addEncodedQuery(enc);
		gr.addQuery('u_category', 'Vacation');
		gr.addNotNullQuery('u_time_card');
		gr.query();
		var hours = 0;

		while (gr.next()) {
			vacationUsed = 0;
			hours += gr.u_time;
			gs.log('Vacation hours += ' + hours, '$$$BGM');
		}
		vacationUsed += hours;
		return vacationUsed;
	},

    type: 'PTOReportUtil'
};