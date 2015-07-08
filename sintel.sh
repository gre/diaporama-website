#!/bin/bash

in=Sintel.2010.720p.mkv
out=.

opts="-b:v 3000k -an"
webmopts="-vcodec libvpx -quality good"
mpegopts="-vcodec libx264"

test -f $in || wget http://ftp.nluug.nl/pub/graphics/blender/demo/movies/$in
ffmpeg -i $in -ss 00:00:22.0 -t 00:00:08.0 $webmopts $opts $out/cut1.webm
ffmpeg -i $in -ss 00:00:35.0 -t 00:00:07.0 $webmopts $opts $out/cut2.webm
ffmpeg -i $in -ss 00:02:57.0 -t 00:00:04.0 $webmopts $opts $out/cut3.webm
ffmpeg -i $in -ss 00:04:47.0 -t 00:00:10.0 $webmopts $opts $out/cut4.webm
ffmpeg -i $in -ss 00:05:20.0 -t 00:00:10.0 $webmopts $opts $out/cut5.webm
