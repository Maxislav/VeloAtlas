/**
 * Created by maxislav on 01.12.16.
 */
import { Point } from './track.var';
import { LngLat } from '../util/lngLat';
import { Track } from './track.service';

export class Util{
  constructor(){
    
  }

  distance(track: Track){
    const arrTrackFull: Array<Point> = track.points;
    var dist_sum = 0;
    var R = 6372795;  //радиус Земли
    var lat1, lat2, long1, long2;

    for (var i = 0; i < (arrTrackFull.length - 1); i++) {

      var dist = this.distanceBetween2(
          new LngLat(arrTrackFull[i].lng, arrTrackFull[i].lat),
          new LngLat(arrTrackFull[i+1].lng, arrTrackFull[i+1].lat),


      );
      dist_sum = dist_sum + dist;
    }
    dist_sum = dist_sum / 1000;
    dist_sum = parseFloat(dist_sum.toFixed(3));
    return dist_sum;
  }

  distanceBetween2(point1: LngLat | Point, point2: LngLat | Point){
    const R = 6372795;  //радиус Земли
    var lat1, lat2, long1, long2;
    lat1 = point1.lat;
    long1 = point1.lng;
    lat2 = point2.lat;
    long2 = point2.lng;
    //перевод коордитат в радианы
    lat1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    long1 *= Math.PI / 180;
    long2 *= Math.PI / 180;
    //вычисление косинусов и синусов широт и разницы долгот
    var cl1 = Math.cos(lat1);
    var cl2 = Math.cos(lat2);
    var sl1 = Math.sin(lat1);
    var sl2 = Math.sin(lat2);
    var delta = long2 - long1;
    var cdelta = Math.cos(delta);
    var sdelta = Math.sin(delta);
    //вычисления длины большого круга
    var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    var x = sl1 * sl2 + cl1 * cl2 * cdelta;
    var ad = Math.atan2(y, x);
    return ad * R;
  }
  
  bearing(points: Array<Point>){

    points.forEach((point:Point, i: number)=>{
      if(i!=points.length-1){
        points[i+1].bearing = getBearing(point.lat, point.lng, points[i+1].lat, points[i+1].lng)
      }
    });

    function radians(n) {
      return n * (Math.PI / 180);
    }
    function degrees(n) {
      return n * (180 / Math.PI);
    }

    function getBearing(startLat,startLong,endLat,endLong){
      startLat = radians(startLat);
      startLong = radians(startLong);
      endLat = radians(endLat);
      endLong = radians(endLong);

      var dLong = endLong - startLong;

      var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
      if (Math.abs(dLong) > Math.PI){
        if (dLong > 0.0)
          dLong = -(2.0 * Math.PI - dLong);
        else
          dLong = (2.0 * Math.PI + dLong);
      }
      return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }

  }
}