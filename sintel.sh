#!/bin/bash

in=Sintel.2010.720p.mkv
out=.

opts="-b:v 3000k -an"
webmopts="-vcodec libvpx -quality good"
mpegopts="-vcodec libx264"

test -f $in || wget http://ftp.nluug.nl/pub/graphics/blender/demo/movies/$in

function part {
  ffmpeg -i $in -ss $2 -t $3 $webmopts $opts $out/$1.webm
  ffmpeg -i $in -ss $2 -t $3 $mpegopts $opts $out/$1.mp4
}

rm cut?.webm cut?.mp4
part cut1 00:00:22.0 00:00:08.0
part cut2 00:00:35.0 00:00:07.0
part cut3 00:02:57.0 00:00:04.0
part cut4 00:04:47.0 00:00:10.0
part cut5 00:05:20.0 00:00:10.0
