
//根据经纬极值计算绽放级别。
import { MapPoint } from '@/types/map'

export function getZoom (points:Array<MapPoint>) {
    let diagPoints=getDiagonal(points);
    let minPoint=diagPoints.minPoint;
    let maxPoint=diagPoints.maxPoint;
    var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
    var distance = getDistance(minPoint,maxPoint).km
    for (let i = 0; i < zoom.length; i++) {
        if(zoom[i] - distance > 0){
            return zoom=18-i-6;    //垂直的缩放水平。
        }
    }

}

export function getVerticalDistance(point1:MapPoint,point2:MapPoint){
    return getDistance({'lat':point1.lat,'lng':point1.lng},{'lat':point1.lat,'lng':point2.lng})
}

export function getHorizontalDistance(point1:MapPoint,point2:MapPoint){
    return getDistance({'lat':point1.lat,'lng':point1.lng},{'lat':point2.lat,'lng':point1.lng})
}
// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export function getDistance(point1:MapPoint, point2:MapPoint) {
    let EARTH_RADIUS = 6378.137;// 地球半径
    let radLat1 = point1.lat * Math.PI / 180.0; //lat1 * Math.PI / 180.0=>弧度计算
    let radLat2 = point2.lat * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = point1.lng * Math.PI / 180.0 - point2.lng * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;// 输出为公里
    return { m: s * 1000, km: Number(s.toFixed(2)) }
}

export function getCenter(points:Array<MapPoint>):MapPoint {
    let diagPoints=getDiagonal(points);
    let minPoint=diagPoints.minPoint;
    let maxPoint=diagPoints.maxPoint;
    return { 'lat':(minPoint.lat+maxPoint.lat)/2,'lng': (minPoint.lng+maxPoint.lng)/2}
}

//获取对角点
export function getDiagonal(points:Array<MapPoint>){
    let minLat=points[0].lat;
    let minLng=points[0].lng;
    let maxLat=points[1].lat;
    let maxLng=points[1].lng;
    for(let point of points){
        if(point.lat<minLat){
            minLat=point.lat
        }
        if(point.lng<minLng){
            minLng=point.lng
        }
        if(point.lat>maxLat){
            maxLat=point.lat
        }
        if(point.lng>maxLng){
            maxLng=point.lng
        }
    }
    let minPoint={'lat':minLat,'lng':minLng}
    let maxPoint={'lat':maxLat,'lng':maxLng}
    return {minPoint,maxPoint}
}