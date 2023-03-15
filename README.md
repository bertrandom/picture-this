# picture-this

Slack next-gen Platform app for generating images with DALL·E

## Configuration

Set your OpenAI key to `OPENAI_API_KEY`:
```
slack env add OPENAI_API_KEY your_key_goes_here
```

If you're testing locally, copy `env.sample.txt` to `.env` and put it in there.

## Triggers

There are two triggers, Create Image trigger and App Mentioned trigger.

Create Image trigger is designed to be used as a shortcut. Paste the shortcut URL into a channel and run the workflow, which will ask you for a prompt, generate an image from that prompt, and share it back into the channel.

App Mentioned trigger will trigger when the app is @mention in a channel specified in the trigger.

## Image Proxy

DALL·E generated images are hosted by OpenAI for a very short window of time, so they are proxied through a fork of [imageproxy](https://github.com/bertrandom/imageproxy) which is running on [openai.bert.org](https://openai.bert.org) which is in turn proxied through nginx.

Configuration for this service is in: `/lib/systemd/system/imageproxy.service`
```
[Unit]
Description=Image Proxy

[Service]
User=web
ExecStart=/home/web/bin/imageproxy \
    -override-cache-control="public" \
    -override-expires="Sat, 28 Dec 2199 04:09:32 GMT" \
    -addr localhost:7003 \
    -allowHosts *.windows.net,httpbin.bert.org \
    -cache /web/openai-image-cache/ \
    -verbose
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

Logs can be tailed with:
```
journalctl -u imageproxy
```

and proxy can be restarted with:
```
systemctl restart imageproxy
```

## License

MIT