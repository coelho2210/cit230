

var d = new Date();
    var weekday = new Array( "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    var day = d.getDate();
    var n = weekday[d.getDay()];
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    var today = n + ', '  + day + ' ' + month + ' ' + year;

    console.log(today);

    document.getElementById("today_date").innerHTML = today;

