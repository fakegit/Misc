## Caution

- Use at your own risk

## How To Build

- Read [Build an Add-on](https://github.com/jc3213/Misc/blob/master/Manual/en-US/HowToBuild.md)

## How to use

- 0) Simple Proxy will not override proxy settings of Firefox 
- 1) Simple Proxy is fully compatible with Auto Proxy Rulelist
  - 1) Support file encoded by base64
- 2) To define a proxy server, you'd use `protocol::address::port`
  - 1) For example, `socks::127.0.0.1::1080`
  - 2) Supported protocol: `http`, `socks`, `socks4`
    - 1) `http`, both HTTP and HTTPS protocol
    - 2) `socks`, SOCKS V5 protocol
    - 3) `socks4`, SOCKS V4 protocol
- 3) Use remote address http:// or https:// to subscribe proxy list
  - 1) For example, [GFWList](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt) (branch ESR)
  - 2) Subscription(s) will be updated in 4 days
  - 3) Support both `.txt` and `.ini` extensions
- 4) User can address absolute path using `Browse...` button in about:addons
- 5) User can address relative path using `file.txt` to access Profile\SimpleProxy\file.txt
- 6) User can modify the rules by click `Edit`
  - 1) User need to click `Save` if any modification has been done
  - 2) Don't support Firefox Android and Thunderbird
- 7) User can clear the profile which is no longer in use by press `Reset`
