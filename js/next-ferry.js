var sf = "SF";
var lk = "LRK";

var lk_to_sf = new Array();
lk_to_sf.push(new ferry_ride(5,50,6,20,lk,sf));
lk_to_sf.push(new ferry_ride(6,35,7,05,lk,sf));
lk_to_sf.push(new ferry_ride(7,10,7,40,lk,sf));
lk_to_sf.push(new ferry_ride(7,50,8,20,lk,sf));
lk_to_sf.push(new ferry_ride(9,15,9,50,lk,sf));
lk_to_sf.push(new ferry_ride(10,10,10,45,lk,sf));
lk_to_sf.push(new ferry_ride(11,10,11,45,lk,sf));
lk_to_sf.push(new ferry_ride(12,40,13,15,lk,sf));
lk_to_sf.push(new ferry_ride(14,15,14,50,lk,sf));
lk_to_sf.push(new ferry_ride(14,50,15,25,lk,sf));
lk_to_sf.push(new ferry_ride(15,40,16,15,lk,sf));
lk_to_sf.push(new ferry_ride(16,15,16,45,lk,sf));
lk_to_sf.push(new ferry_ride(17,10,17,45,lk,sf));
lk_to_sf.push(new ferry_ride(17,35,18,10,lk,sf));
lk_to_sf.push(new ferry_ride(18,35,19,10,lk,sf));
lk_to_sf.push(new ferry_ride(19,20,19,55,lk,sf));
lk_to_sf.push(new ferry_ride(20,10,20,45,lk,sf));
lk_to_sf.push(new ferry_ride(20,50,21,25,lk,sf));
lk_to_sf.push(new ferry_ride(23,50,23,55,lk,sf));

var sf_to_lk = new Array();
sf_to_lk.push(new ferry_ride(6,25,6,55,sf,lk));
sf_to_lk.push(new ferry_ride(7,10,7,40,sf,lk));
sf_to_lk.push(new ferry_ride(7,45,8,15,sf,lk));
sf_to_lk.push(new ferry_ride(8,30,9,05,sf,lk));
sf_to_lk.push(new ferry_ride(9,10,9,45,sf,lk));
sf_to_lk.push(new ferry_ride(10,10,10,45,sf,lk));
sf_to_lk.push(new ferry_ride(10,55,11,30,sf,lk));
sf_to_lk.push(new ferry_ride(11,55,12,30,sf,lk));
sf_to_lk.push(new ferry_ride(13,25,14,00,sf,lk));
sf_to_lk.push(new ferry_ride(15,00,15,30,sf,lk));
sf_to_lk.push(new ferry_ride(15,35,16,05,sf,lk));
sf_to_lk.push(new ferry_ride(16,25,16,55,sf,lk));
sf_to_lk.push(new ferry_ride(17,30,18,05,sf,lk));
sf_to_lk.push(new ferry_ride(17,55,18,25,sf,lk));
sf_to_lk.push(new ferry_ride(18,20,18,50,sf,lk));
sf_to_lk.push(new ferry_ride(19,20,19,50,sf,lk));
sf_to_lk.push(new ferry_ride(20,10,20,40,sf,lk));
sf_to_lk.push(new ferry_ride(20,50,21,20,sf,lk));
sf_to_lk.push(new ferry_ride(21,35,22,05,sf,lk));

// TODO return onto those schedules that the user has selected
function schedules(){
  return [lk_to_sf, sf_to_lk]
}

function time_to_str(date_time){
  h = date_time.getHours();
  m = date_time.getMinutes();
  ampm = (h < 12) ? "AM" : "PM"
  hour_str = (h < 13) ? h : (h - 12)
  min_str  = (m < 10) ? ("0" + m) : m
  return hour_str + ":" + min_str + ampm;
}

function ferry_ride(departure_hour, departure_minute, arrival_hour, arrival_minute, starts_from, goes_to){
  this.departure_date = new Date();
  this.departure_date.setHours(departure_hour);
  this.departure_date.setMinutes(departure_minute);
  this.departure_str = time_to_str(this.departure_date);
  this.arrival_date = new Date();
  this.arrival_date.setHours(arrival_hour);
  this.arrival_date.setMinutes(arrival_minute);
  this.arrival_str = time_to_str(this.arrival_date);
  this.starts_from = starts_from;
  this.goes_to = goes_to;
}

// cribbed from http://blogs.digitss.com/javascript/calculate-datetime-difference-simple-javascript-code-snippet/
function get_time_difference(earlierDate, laterDate){
  var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
  var oDiff = new Object();
  oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
  nTotalDiff -= oDiff.days*1000*60*60*24;
  oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
  nTotalDiff -= oDiff.hours*1000*60*60;
  oDiff.minutes = Math.floor(nTotalDiff/1000/60);
  nTotalDiff -= oDiff.minutes*1000*60;
  oDiff.seconds = Math.floor(nTotalDiff/1000);
  return oDiff;
}

function time_diff_in_words(earlier, later){
  diff = get_time_difference(earlier, later);
  h = (diff.hours > 0) ? (diff.hours + "h ") : "";
  m = diff.minutes + "m";
  return (h + m);
}

function print_ride(ferry_ride, is_next){
  css_class = (is_next) ? "next ride" : "ride";
  leaves_in = (is_next) ? "<li class='leaves-in'>Leaves in<br/><span class='time'>" + time_diff_in_words(new Date(), ferry_ride.departure_date) + "</span></li>" : "";
  return "<div class='" + css_class + "'>" + leaves_in +
    "<li class='locations'>Departs<br/><span class='loc'>" + ferry_ride.starts_from + "</span><br/><span class='time'>" + ferry_ride.departure_str + "</span></li>" +
    "<li class='locations'>Arrives<br/><span class='loc'>" + ferry_ride.goes_to + "</span><br/><span class='time'>" + ferry_ride.arrival_str + "</span></li>"
};

var curr_time = new Date();
var has_next_ferry = false;
$.each(schedules(), function(index, schedule) {
  var num_next_ferries_this_schedule = 0;
  $.each(schedule, function(index, ferry_ride) {
    $("#full-schedule").append(print_ride(ferry_ride));
    if (ferry_ride.departure_date > curr_time && num_next_ferries_this_schedule < 2) {
      num_next_ferries_this_schedule++;
      $("#next-ferry").append(print_ride(ferry_ride, "bold"));
      has_next_ferry = true;
    };
  });
});

if (!has_next_ferry){
  $("#next-ferry").append("Doh! No more ferry for you!<br/>" +
    "<a href='tel:+415-258-9980'>Dial Marin Green Cab</a> or " + 
    "<a href='tel:+415.333.3333'>Dial SF Yellow Cab</a><br/>"
    );
}