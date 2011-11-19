describe("schedule", function() {

  it("has SF and LRK schedules", function() {
    expect(lk_to_sf).toBeDefined();
    expect(sf_to_lk).toBeDefined();
  });
  
  it("returns active schedules", function() {
    expect(schedules()).toEqual([lk_to_sf, sf_to_lk]);
  });

});

describe("time calculations", function() {
  
  var early_date = new Date();
  early_date.setHours(1);
  early_date.setMinutes(5);
  
  var late_date = new Date();
  late_date.setHours(16);
  late_date.setMinutes(5);
  
  it("prints early times correctly", function() {
    expect(time_to_str(early_date)).toEqual("1:05AM");
  });
  
  it("prints late times correctly", function() {
    expect(time_to_str(late_date)).toEqual("4:05PM");
  });
  
  it("prints the correct time difference", function() {
    expect(time_diff_in_words(early_date, late_date)).toEqual("15h 0m");
  });


});

describe("ferry class", function() {
  
  var ride = new ferry_ride(5,50,6,20,lk,sf);
  
  it("instantiates correctly", function() {
    expect(ride.departure_str).toEqual("5:50AM");
    expect(ride.arrival_str).toEqual("6:20AM");
    expect(ride.starts_from).toEqual("LRK");
    expect(ride.goes_to).toEqual("SF");
  });
  
});