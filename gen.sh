#!/bin/bash

in=garden/originals/
out=garden/

opts="-b:v 3000k -an -vf scale=w=iw/2:h=ih/2"
webmopts="-vcodec libvpx -quality good"
mpegopts="-vcodec libx264"

function gen {
  ffmpeg -i $in/$1.mp4 $webmopts $opts $out/$1.webm
  ffmpeg -i $in/$1.mp4 $mpegopts $opts $out/$1.mp4
  ffmpeg -i $in/$1.mp4 -vframes 1 $out/$1.png
}

gen concombre-chinois_zoom
gen po-melon_vue_ensemble
gen salades_vue_ensemble
gen po-melon_aggripe
gen po-melon_zoom
gen tomates_zoom
