export default function() {
    // var devicePixelRatio = 1;
    // var scale = 1 / devicePixelRatio;
    // document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    // 7.5根据设计稿的横向分辨率/100得来
    // alert(document.documentElement.clientWidth)
    var deviceWidth = document.documentElement.clientWidth;
    // var deviceWidth = window.screen.availWidth
    // alert(navigator.userAgent)
    // alert(deviceWidth)
    // console.log(navigator.userAgent)
    if(deviceWidth > 750) {
        // deviceWidth = 750;
        deviceWidth = 19.2 * 50;
    }

    document.documentElement.style.fontSize = deviceWidth / 19.2 + 'px';

   
}