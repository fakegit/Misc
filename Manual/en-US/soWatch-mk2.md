##Caution

- Use at your own risk
- It will take some time to download the players after installation

##How To Build

- Read [Build an Add-on](https://github.com/jc3213/Misc/blob/master/Manual/en-US/HowToBuild.md)

##About soWatch!

- soWatch! supports at least Firefox 10.0
- soWatch! equivalent to the lesser function version of soWatch! mk2, which is seldom updated
- soWatch! do not have either Player Auto Update function or Toolbar UI
- If you want to use offline players, you have to download or update them manually
- You can fork the source of soWatch! to make it act more like soWatch! mk2

##About Rulelist

- Read [How to Write Rulelist](https://github.com/jc3213/Misc/blob/master/Manual/en-US/soWatch-mk2.rulelist.md)

##How To Use

- `Restore Default`, restore all settings to default (some are not affected)
  - `Next Update Time`, `Defined Folder`, `Defined Server`
- `Toolbar Button`, Add/remove the soWatch! mk2 button to/from the Toolbar
- `Next Update Time`, when an auto update session will be processed next time.
- `Update Period *day*`, the time period till the next auto update session, in `XX days`
- `Manual Update`, ignore `Update Period`, and download the latest players immediately
- `Offline Player`s, access and load players stored in local folder rather than those on remote server
- `Defined Folder`,  use `Browse...` to define the folder you'd like to save the players
  - If no folder is defined, it will return `Profiles\soWatch`
- `Defined Server`, you can upload players to your private host and share with your friends
  - If no server is defined, it will return `15536900@bitbucket.org`
- `Option: YYYY`, options for each of the video sites, some of the preferences are binded together
  - `Enable mod Player`, override the original player with an modded player
  - `Filter xml Request`, block specified XML request(s), may be buggy
  - `Support the Website`, user should support the website which he/she visit most by perchasing its premium
