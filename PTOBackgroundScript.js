var firstQuery = 'u_cost_codeIN'; 
var codes = []; 
var cc = new GlideRecord('u_payroll_cost_codes'); 
cc.addQuery('u_active', true); 
cc.query(); 
while (cc.next()) { 
codes.push(cc.u_cost_code.split(',')); 
} 
var secondQuery = codes; 
var finalQuery = firstQuery + secondQuery; 
//Encoded query used to populate report 
var userQ = new GlideRecord('sys_user'); 
userQ.addEncodedQuery(finalQuery); 
userQ.addQuery('active', true); 
//userQ.setLimit(10); 
userQ.query(); 
while (userQ.next()) { 
var enc = 'u_time_card.u_dateONThis year@javascript:gs.beginningOfThisYear()@javascript:gs.endOfThisYear()'; 
var ga = new GlideAggregate('u_tctimeoff'); 
ga.addAggregate('SUM', 'u_time'); 
ga.addEncodedQuery(enc); 
ga.addQuery('u_user', userQ.sys_id); 
ga.addQuery('u_category', 'Vacation'); 
ga.groupBy('u_category'); 
ga.query(); 

var vacationUsed = 0; 

gs.print('***' + userQ.name + '***'); 
if (ga.next()) { 
vacationUsed = ga.getAggregate('SUM', 'u_time'); 

gs.print('Vacation used ' + vacationUsed); 
} 
var ga = new GlideAggregate('u_tctimeoff'); 
ga.addAggregate('SUM', 'u_time'); 
ga.addEncodedQuery(enc); 
ga.addQuery('u_user', userQ.sys_id); 
ga.addQuery('u_category', 'Sick'); 
ga.groupBy('u_category'); 
ga.query(); 
var sickUsed = 0; 

if (ga.next()) { 
sickUsed = ga.getAggregate('SUM', 'u_time');  
} 
gs.print('Sick used ' + sickUsed);

userQ.u_vacation_used = vacationUsed;
userQ.u_vacation_remaining = userQ.u_vacation_allowed - vacationUsed;
userQ.u_sick_used = sickUsed; 
userQ.u_sick_remaining = userQ.u_sick_allowed - sickUsed; 
userQ.update(); 
}