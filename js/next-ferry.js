var sf = "SF";
var lk = "LRK";

var lk_to_sf = new Array();
lk_to_sf.push(new ferry_ride(5,45,6,15,lk,sf));
lk_to_sf.push(new ferry_ride(6,35,7,05,lk,sf));
lk_to_sf.push(new ferry_ride(7,00,7,30,lk,sf));
lk_to_sf.push(new ferry_ride(7,30,8,00,lk,sf));
lk_to_sf.push(new ferry_ride(7,50,8,20,lk,sf));
lk_to_sf.push(new ferry_ride(8,20,8,50,lk,sf));
lk_to_sf.push(new ferry_ride(9,15,9,50,lk,sf));
lk_to_sf.push(new ferry_ride(10,10,10,45,lk,sf));
lk_to_sf.push(new ferry_ride(11,10,11,45,lk,sf));
lk_to_sf.push(new ferry_ride(12,40,13,15,lk,sf));
lk_to_sf.push(new ferry_ride(14,15,14,50,lk,sf));
lk_to_sf.push(new ferry_ride(14,50,15,25,lk,sf));
lk_to_sf.push(new ferry_ride(15,40,16,15,lk,sf));
lk_to_sf.push(new ferry_ride(16,15,16,45,lk,sf));
lk_to_sf.push(new ferry_ride(17,05,17,40,lk,sf));
lk_to_sf.push(new ferry_ride(17,40,18,15,lk,sf));
lk_to_sf.push(new ferry_ride(18,35,19,10,lk,sf));
lk_to_sf.push(new ferry_ride(19,25,20,00,lk,sf));
lk_to_sf.push(new ferry_ride(20,50,21,25,lk,sf));

var sf_to_lk = new Array();
sf_to_lk.push(new ferry_ride(6,20,6,50,sf,lk));
sf_to_lk.push(new ferry_ride(7,10,7,40,sf,lk));
sf_to_lk.push(new ferry_ride(7,35,8,05,sf,lk));
sf_to_lk.push(new ferry_ride(8,30,9,05,sf,lk));
sf_to_lk.push(new ferry_ride(9,10,9,45,sf,lk));
sf_to_lk.push(new ferry_ride(10,10,10,45,sf,lk));
sf_to_lk.push(new ferry_ride(10,55,11,30,sf,lk));
sf_to_lk.push(new ferry_ride(11,55,12,30,sf,lk));
sf_to_lk.push(new ferry_ride(13,25,14,00,sf,lk));
sf_to_lk.push(new ferry_ride(15,00,15,30,sf,lk));
sf_to_lk.push(new ferry_ride(15,25,16,05,sf,lk));
sf_to_lk.push(new ferry_ride(16,25,16,55,sf,lk));
sf_to_lk.push(new ferry_ride(17,00,17,30,sf,lk));
sf_to_lk.push(new ferry_ride(17,20,18,05,sf,lk));
sf_to_lk.push(new ferry_ride(17,55,18,25,sf,lk));
sf_to_lk.push(new ferry_ride(18,25,18,55,sf,lk));
sf_to_lk.push(new ferry_ride(19,20,19,50,sf,lk));
sf_to_lk.push(new ferry_ride(20,10,20,40,sf,lk));
sf_to_lk.push(new ferry_ride(21,35,22,05,sf,lk));

function geocode_url(lat, lon){
 return "http://where.yahooapis.com/geocode?location=" + lat + "+" + lon + "&gflags=R&flags=J&appid=yourappid";
}

function filter_next_ferry_list_by_geography(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var url = geocode_url(position.coords.latitude,position.coords.longitude);
        $.getJSON(url,function(data) {
          city = data.ResultSet.Results[0].city;
          if (city.length > 0){
            if ("San Francisco" == city){
              remove_rides_by_class("LRK");
            } else {
              remove_rides_by_class("SF");
            }
          };

        });
      },
      function (error){}
    );
  };
};

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
};

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
};

function time_diff_in_words(earlier, later){
  diff = get_time_difference(earlier, later);
  h = (diff.hours > 0) ? (diff.hours + "h ") : "";
  m = diff.minutes + "m";
  return (h + m);
};

function print_ride(ferry_ride, is_next){
  css_class = (is_next) ? "next ride" : "ride";
  leaves_in = (is_next) ? "<li class='leaves-in'>Leaves in<br/><span class='time'>" + time_diff_in_words(new Date(), ferry_ride.departure_date) + "</span></li>" : "";
  return "<div class='" + css_class + " " + ferry_ride.starts_from + "'>" + leaves_in +
    "<li class='locations'>Departs<br/><span class='loc'>" + ferry_ride.starts_from + "</span><br/><span class='time'>" + ferry_ride.departure_str + "</span></li>" +
    "<li class='locations'>Arrives<br/><span class='loc'>" + ferry_ride.goes_to + "</span><br/><span class='time'>" + ferry_ride.arrival_str + "</span></li>"
};

function remove_rides_by_class(css_class){
  $("." + css_class).remove();
}

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

filter_next_ferry_list_by_geography();
