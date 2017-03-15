## Caution

- Use at your own risk

## How To Build

- Read [Build an Add-on](https://github.com/jc3213/Misc/blob/master/Manual/en-US/HowToBuild.md)

## How to use

- 0) Simple Proxy will not override proxy settings of Firefox 
- 1) Simple Proxy is full compatibility with Auto Proxy Rulelist (branch ESR)
  - 1) Compatible with base64 encoding
- 2) Server must match the form of protocol::address::port
  - 1) For example, socks::127.0.0.1::1080
  - 2) Supported protocol: http, socks, socks4
    - 1) http support both HTTP and HTTPS protocol
    - 2) socks support SOCKS V5 protocol
    -3) socks4 support SOCKS V4 protocol
- 3) Use remote address http:// or https:// to subscribe proxy list
  - 1) For example, [GFWList](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt) (branch ESR)
  - 2) Subscription(s) will be updated in 4 days
- 4) User can address absolute path using "Browse..." button in about:addons
- 5) User can address relative path using file.txt to access the rulelist in Profile\SimpleProxy\file.txt
- 6) User can modify the rules by click "Edit: Rulelist **"
  - 1) User need to click "save" before "close" the "editor" if any modification has been done
  - 2) Subscription(s) should not be modified
- 7) User can clear the profile which is no longer in use by press "Clear: Profile **"
