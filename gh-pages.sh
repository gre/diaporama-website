#!/bin/bash

out=${1:-"../diaporama-gh-pages/"}

test -d $out || exit 1;
which browserify || exit 2;
which uglifyjs || exit 2;

rm -rf $out/*
browserify index.js| uglifyjs -cm > $out/bundle.js
cp -R example1/ $out/example1
cp -R garden/ $out/garden
cp -R example3/ $out/example3
cp index.css $out
cp index.html $out

cd $out
