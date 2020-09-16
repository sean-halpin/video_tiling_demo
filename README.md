## Create LIVE streams in each streamX folder

```
// Change the pattern between 1-12
gst-launch-1.0 videotestsrc pattern=2 is-live=true ! x264enc ! hlssink max-files=5
```

## Run the video mixer in the Vegas folder

```
node vegas.js
```

This small script will search the stream folders for `playlist.m3u8` HLS manifests & assemble a pipeline to compose the HLS streams into a single stream

Assembling a pipeline similar to this.
```
gst-launch-1.0 videomixer name=mixer \
sink_0::xpos=0 sink_0::ypos=0  \
sink_1::xpos=320 sink_1::ypos=0  \
sink_2::xpos=0 sink_2::ypos=240  \
sink_3::xpos=320 sink_3::ypos=240  \
! queue ! videoconvert ! queue ! videoscale ! queue ! autovideosink \
filesrc location=/home/user/playground/hls_exp/vegas/../stream1/playlist.m3u8 ! hlsdemux ! decodebin ! queue ! mixer. \
filesrc location=/home/user/playground/hls_exp/vegas/../stream2/playlist.m3u8 ! hlsdemux ! decodebin ! queue ! mixer. \
filesrc location=/home/user/playground/hls_exp/vegas/../stream3/playlist.m3u8 ! hlsdemux ! decodebin ! queue ! mixer. \
filesrc location=/home/user/playground/hls_exp/vegas/../stream4/playlist.m3u8 ! hlsdemux ! decodebin ! queue ! mixer. 
```