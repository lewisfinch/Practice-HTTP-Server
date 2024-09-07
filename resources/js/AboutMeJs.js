
function result() {
    var input = document.getElementById("date").value;
    var indate = new Date(input);
    var Today = new Date();
    var difference = (indate.getTime() - Today.getTime()) / (1000 * 60 * 60 * 24);

    if (isNaN(Date.parse(indate))) {
        document.getElementById("para").innerHTML = "Not a good day!";
        document.getElementById("para").style.color = "red";
    }
    else {
        if (difference < 0) {
            document.getElementById("para").innerHTML = "Already happened";
            document.getElementById("para").style.color = "red";
        }
        else {
            document.getElementById("para").innerHTML = parseInt(difference) + " days remaining";
            document.getElementById("para").style.color = "black";
        }
    }

}
