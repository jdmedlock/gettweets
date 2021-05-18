


[contributors-shield]: https://img.shields.io/github/contributors/jdmedlock/gettweets.svg?style=for-the-badge
[contributors-url]: https://github.com/jdmedlock/gettweets/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jdmedlock/gettweets.svg?style=for-the-badge
[forks-url]: https://github.com/jdmedlock/gettweets/network/members
[stars-shield]: https://img.shields.io/github/stars/jdmedlock/gettweets.svg?style=for-the-badge
[stars-url]: https://github.com/jdmedlock/gettweets/stargazers
[issues-shield]: https://img.shields.io/github/issues/jdmedlock/gettweets.svg?style=for-the-badge
[issues-url]: https://github.com/jdmedlock/gettweets/issues

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

# gettweets

getTweets is a command line app that creates a JSON file containing Tweets
extracted from Twitter for a specific screen name.

[Process Overview](#process-overview) - [Installation](#installation) - [Usage](#usage) - [Release History](#release-history) - [License](#license)
## Process Overview

Given a Twitter screen name and a starting and ending date range, getTweets
extracts all tweets posted by that user within that particular range of dates
into a JSON file.

Only the following public information is extracted and added to the JSON file:
```
[
  {
    "text": "Chingu Voyage 31 starts on May 31!\n\n- Contribute in a team\n- Use Agile Methodology\n- Get out of your comfort zone\n- Beat Tutorial Purgatory\n\nLevel-up your Developer career @ https://t.co/w6nq9Dl8a9\n#freeCodeCamp #100DaysOfCode #DEVCommunity #WomenInTech #developers #webdevelopers https://t.co/9yydPeYLbb",
    "entities": {
      "urls": [{
        "start": <integer>,
        "end": <integer>,
        "url": "<url-string>",
        "expanded_url": "<url-string>",
        "display_url": "<url-string>"
      },
      additional urls...
      ],
      "hashtags": [{
        "start": <integer>,
        "end": <integer>,
        "tag": "<hashtag-string>"
      },
      additional hashtags... 
      ]
    },
    "author_id": "<account-id>",
    "id": "<tweet-id>",
    "public_metrics": {
      "retweet_count": <integer-count>,
      "reply_count": <integer-count>,
      "like_count": <integer-count>,
      "quote_count": <integer-count>
    },
    "created_at": "<ISO-8601-format>"
  },
  additional-Tweets...
]
```

For details about each field please refer to the [Twitter Developer Documentation](https://developer.twitter.com).

## Installation

To install this app:
```
git clone https://github.com/jdmedlock/gettweets.git
npm i
```

To run the app check out the information in the *_'Usage'_* section below.

## Usage

getTweets is a command line application (CLI). The basic command to run it is:
```
node getTweets extract <flags>
```

Before running it you'll first need to identify option values you'll using 
in both the command line and the CLI `.env` file. 

| CLI Flag        | `.env` Parm    | Description                              |
|-----------------|----------------|------------------------------------------|
| no equivalent   | TWITTER_BEARER_TOKEN | Your Twitter bearer token |
| -d, --debug     | DEBUG          | Debug switch to add runtime info to console (YES/NO) |
| -u, --user      | SCREEN_NAME    | User screen name posting the tweets to be extracted |
| -o, --output    | FILE_PATH      | Path including fully qualified file name the JSON is to be written to |
| -s, --startdate | START_DATE     | Extract Tweets starting from this date |
| -s, --enddate   | END_DATE       | Extract Tweets through this date (inclusive) |
 
It's important to keep in mind that options you supply on the command line
ALWAYS override the same option you specify in the `.env` file.

`env.sample` in the root of the project contains a sample of how to set up a `.env` file.

### CLI Examples

In a terminal session issue the following to create a JSON file of Tweets 
extracted for `jd_medlock` from May 10-16, 2021
```
node getTweets extract -u jd_medlock -s 2021-05-10 -e 2021-05-16 -o /Users/jim/Downloads/tweets.json
```

Example contents of the `tweets.json` file:

```
[{
    "text": "https://t.co/PVx2F6Spke",
    "id": "1393690349902643200",
    "created_at": "2021-05-15T22:10:47.000Z",
    "public_metrics": {
      "retweet_count": 1,
      "reply_count": 1,
      "like_count": 3,
      "quote_count": 1
    },
    "entities": {
      "urls": [{
        "start": 0,
        "end": 23,
        "url": "https://t.co/PVx2F6Spke",
        "expanded_url": "https://youtu.be/MCwJfETgiVo",
        "display_url": "youtu.be/MCwJfETgiVo",
        "images": [{
          "url": "https://pbs.twimg.com/news_img/1393867031347437569/N8Fkdaev?format=jpg&name=orig",
          "width": 1280,
          "height": 720
        }, {
          "url": "https://pbs.twimg.com/news_img/1393867031347437569/N8Fkdaev?format=jpg&name=150x150",
          "width": 150,
          "height": 150
        }],
        "status": 200,
        "title": "Agile Rhapsody - Bohemian Rhapsody Parody - Scrum Team Building - Agile Manifesto in a fun song",
        "description": "Agile Rhapsody Parody Cover - Halftime Show - The ABCs of Agile Product Management. Based on original song “Bohemian Rhapsody” by Freddy Mercury and Queen. A...",
        "unwound_url": "https://www.youtube.com/watch?v=MCwJfETgiVo&feature=youtu.be"
      }]
    },
    "author_id": "16371518"
  },
  {
    "text": "@ChinguCollabs The Lighthouse tool in Dev Tools is a great way to validate this in an app!!! https://t.co/YBA989hwpi",
    "id": "1393554647374249985",
    "created_at": "2021-05-15T13:11:33.000Z",
    "public_metrics": {
      "retweet_count": 0,
      "reply_count": 0,
      "like_count": 1,
      "quote_count": 0
    },
    "entities": {
      "urls": [{
        "start": 93,
        "end": 116,
        "url": "https://t.co/YBA989hwpi",
        "expanded_url": "https://twitter.com/jd_medlock/status/1393554647374249985/photo/1",
        "display_url": "pic.twitter.com/YBA989hwpi"
      }],
      "mentions": [{
        "start": 0,
        "end": 14,
        "username": "ChinguCollabs"
      }]
    },
    "author_id": "16371518"
  }
]
```

## Release History

You can find what changed, when in the [release history](./docs/RELEASE_HISTORY.md)

## License

Copyright 2021 &copy; Chingu, Inc.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
