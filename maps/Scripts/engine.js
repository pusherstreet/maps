﻿var EarthRadiusMeters = 6378137.0; // meters
/* Based the on the Latitude/longitude spherical geodesy formulae & scripts
   at http://www.movable-type.co.uk/scripts/latlong.html
   (c) Chris Veness 2002-2010
*/
google.maps.LatLng.prototype.DestinationPoint = function (brng, dist) {
    var R = EarthRadiusMeters; // earth's mean radius in meters
    var brng = brng.toRad();
    var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist / R) +
                          Math.cos(lat1) * Math.sin(dist / R) * Math.cos(brng));
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist / R) * Math.cos(lat1),
                                 Math.cos(dist / R) - Math.sin(lat1) * Math.sin(lat2));

    return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}

// === A function which returns the bearing between two LatLng in radians ===
// === If v1 is null, it returns the bearing between the first and last vertex ===
// === If v1 is present but v2 is null, returns the bearing from v1 to the next vertex ===
// === If either vertex is out of range, returns void ===
google.maps.LatLng.prototype.Bearing = function (otherLatLng) {
    var from = this;
    var to = otherLatLng;
    if (from.equals(to)) {
        return 0;
    }
    var lat1 = from.latRadians();
    var lon1 = from.lngRadians();
    var lat2 = to.latRadians();
    var lon2 = to.lngRadians();
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0.0) angle += Math.PI * 2.0;
    if (angle > Math.PI) angle -= Math.PI * 2.0;
    return parseFloat(angle.toDeg());
}



Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};



Number.prototype.toDeg = function () {
    return this * 180 / Math.PI;
};


Number.prototype.toBrng = function () {
    return (this.toDeg() + 360) % 360;
};

var infowindow = new google.maps.InfoWindow(
  {
      size: new google.maps.Size(150, 50)
  });


function createMarker(latlng, html) {
    var contentString = html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    bounds.extend(latlng);
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}



function drawArc(center, initialBearing, finalBearing, radius) {
    var d2r = Math.PI / 180;   // degrees to radians 
    var r2d = 180 / Math.PI;   // radians to degrees 

    var points = 32;

    // find the raidus in lat/lon 
    var rlat = (radius / EarthRadiusMeters) * r2d;
    var rlng = rlat / Math.cos(center.lat() * d2r);

    var extp = new Array();

    if (initialBearing > finalBearing) finalBearing += 360;
    var deltaBearing = finalBearing - initialBearing;
    deltaBearing = deltaBearing / points;
    for (var i = 0; (i < points + 1) ; i++) {
        extp.push(center.DestinationPoint(initialBearing + i * deltaBearing, radius));
        bounds.extend(extp[extp.length - 1]);
    }
    return extp;
}




function drawCircle(point, radius) {
    var d2r = Math.PI / 180;   // degrees to radians 
    var r2d = 180 / Math.PI;   // radians to degrees 
    var EarthRadiusMeters = 6378137.0; // meters
    var earthsradius = 3963; // 3963 is the radius of the earth in miles

    var points = 32;

    // find the raidus in lat/lon 
    var rlat = (radius / EarthRadiusMeters) * r2d;
    var rlng = rlat / Math.cos(point.lat() * d2r);


    var extp = new Array();
    for (var i = 0; i < points + 1; i++) // one extra here makes sure we connect the 
    {
        var theta = Math.PI * (i / (points / 2));
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
        extp.push(new google.maps.LatLng(ex, ey));
        bounds.extend(extp[extp.length - 1]);
    }
    // alert(extp.length);
    return extp;
}