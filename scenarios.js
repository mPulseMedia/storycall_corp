/* scenarios.js — edit directly */
var SCENARIOS_DATA = {
  "purpose"                        : ["These scenarios illustrate typical interactions between ",
                                      "users (i.e., Kid), recipients (i.e., Grandma), and StoryCall. ",
                                      "They serve as a reference for how StoryCall should respond ",
                                      "in each situation."],
  "groups"                         : [
    {
      "group_title"                : "1 Perfect",
      "group_scenarios"            : [
        {
          "scenario_title"         : "1A Perfect onboarding",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "1A1",
              "text"               : "storycall",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "1A2",
              "text"               : ["Hi. StoryCall will convert your voice recordings ",
                                      "into scheduled phone calls.\n\n",
                                      "To begin, text me the PHONE NUMBER to deliver ",
                                      "your recording to.\n\n",
                                      "Text STOP or HELP at any time."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "1A3",
              "text"               : "2125551234",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "1A4",
              "text"               : ["StoryCall: Perfect. Now SMS me a voice recording ",
                                      "and I'll deliver it to 212-555-1234.\n\n",
                                      "To do this on iPhones, tap the the attachment [+] button and choose Audio. ",
                                      "On Android, hold down the microphone button.\n\n",
                                      "For help, text VOICE."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "1A5",
              "text"               : ["Hi Grandma. Were you popular in high school?"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "telephone_parts"    : [
                  {
                    "id"              : "1A6",
                    "text"            : "You have a new recorded message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "1A7",
                    "text"            : ["Hi Grandma. Were you popular in high school?"],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "1A5",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "1A8",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "1A9",
              "text"               : ["I was in a group of seven girls and we called ",
                                      "ourselves the Cats. I guess we were a little ",
                                      "popular."],
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "speaker"            : "grandma",
              "format"             : "audio"
            },
            {
              "id"                 : "1A10",
              "text"               : ["I was in a group of seven girls and we called ",
                                      "ourselves the Cats. I guess we were a little ",
                                      "popular."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "audio",
              "derived_from"       : {
                "utterance_id"     : "1A9",
                "kind"             : "relay",
                "via"              : "sms_audio_relay"
              }
            }
          ]
        },
        {
          "scenario_title"         : "1B Perfect message exchange",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "1B1",
              "text"               : ["Hi Grandma — what was it like on Christmas ",
                                      "morning?"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "telephone_parts"    : [
                  {
                    "id"              : "1B2",
                    "text"            : "You have a new message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "1B3",
                    "text"            : ["Hi Grandma — what was it like on Christmas ",
                                      "morning?"],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "1B1",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "1B4",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "1B5",
              "text"               : "Can you call me back in about an hour?",
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "speaker"            : "grandma",
              "format"             : "audio"
            },
            {
              "id"                 : "1B6",
              "text"               : "StoryCall: I'll try again in an hour.",
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "type"               : "event",
              "id"                 : "1B7",
              "label"              : "1 hour later",
              "seconds"            : 3600,
              "after_utterance_id" : "1B6",
              "before_utterance_id" : "1B8"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 2,
              "telephone_parts"    : [
                  {
                    "id"              : "1B8",
                    "text"            : "Calling back with your new message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "1B9",
                    "text"            : ["Hi Grandma — what was it like on Christmas ",
                                      "morning?"],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "1B1",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "1B10",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "1B11",
              "text"               : ["We got up early and we all sat at the top of ",
                                      "the steps and we opened the stockings first ",
                                      "and then ripped through every present\n",
                                      "and then had brunch and it was wonderful."],
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "speaker"            : "grandma",
              "format"             : "audio"
            },
            {
              "id"                 : "1B12",
              "text"               : ["We got up early and we all sat at the top of ",
                                      "the steps and we opened the stockings first ",
                                      "and then ripped through every present and then ",
                                      "had brunch and it was wonderful."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "audio",
              "derived_from"       : {
                "utterance_id"     : "1B11",
                "kind"             : "relay",
                "via"              : "sms_audio_relay"
              }
            },
            {
              "id"                 : "1B13",
              "text"               : ["We got up early and we all sat at the top of ",
                                      "the steps and we opened the stockings first ",
                                      "and then ripped through every\n",
                                      "present and then had brunch and it was wonderful."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text",
              "derived_from"       : {
                "utterance_id"     : "1B11",
                "kind"             : "transcript",
                "via"              : "sms_text_transcript"
              }
            }
          ]
        }
      ]
    },
    {
      "group_title"                : "2 Setup issues",
      "group_scenarios"            : [
        {
          "scenario_title"         : "2A Kid error: Keyword wrong",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "2A1",
              "text"               : "story",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text",
              "mistakes"           : [
                {
                "kind"             : "incorrect_keyword",
                "message"          : "Kid texts incorrect keyword"
                }
              ]
            },
            {
              "id"                 : "2A2",
              "text"               : ["Sorry — 'storycall' is the official ",
                                      "keyword.\n\n",
                                      "Please text storycall to officially opt ",
                                      "in and approve receiving messages from me."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "2A3",
              "text"               : "storycall",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "2B Kid error: Phone number incomplete",
          "scenario_precursor"     : ["Precursor: Kid has submitted the keyword ",
                                      "correctly."],
          "scenario_steps"         : [
            {
              "id"                 : "2B1",
              "text"               : "5551234",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "2B2",
              "text"               : ["StoryCall: That doesn't look like a ",
                                      "complete phone number — I need a full ",
                                      "10-digit number including area code.\n\n",
                                      "Please text the phone number again with ",
                                      "the area code (example: 2125551234)."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "2B3",
              "text"               : "2125551234",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "2B4",
              "text"               : ["StoryCall: Now SMS me a voice recording ",
                                      "and I'll deliver it to 212-555-1234.\n\n",
                                      "On iOS, tap the the attachment + button and choose Audio, ",
                                      "and on Android, hold down the microphone button.\n\n",
                                      "Text VOICE for help on how to do this."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "2C Change the call-to number",
          "scenario_precursor"     : ["Precursor: Kid has previously provided the ",
                                      "phone number with area code 415–555–1234."],
          "scenario_steps"         : [
            {
              "id"                 : "2C1",
              "text"               : ["Actually from now on, can you deliver my ",
                                      "messages to 650-555-1234"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "2C2",
              "text"               : ["StoryCall: I'll now call 650-555-1234 ",
                                      "with your future messages."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "2D HELP: change the number",
          "scenario_precursor"     : ["Precursor: Kid has submitted the keyword and phone number",
                                      "correctly."],
          "scenario_steps"         : [
            {
              "id"                 : "2D1",
              "text"               : "HELP I need to change who you call",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "2D2",
              "text"               : ["StoryCall: To change the call-to number, send the ",
                                      "new phone number as an audio recording.\n",
                                      "After I confirm it, I'll use that new ",
                                      "number for your future messages."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        }
      ]
    },
    {
      "group_title"                : "3 Message issues",
      "group_scenarios"            : [
        {
          "scenario_title"         : "3A Kid error: Text to Grandma",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "3A1",
              "text"               : "Hi Grandma! Miss you. ❤️",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text",
              "mistakes"           : [
                {
                "kind"             : "text_instead_of_voice",
                "message"          : "Kid sends text to Grandma"
                }
              ]
            },
            {
              "id"                 : "3A2",
              "text"               : ["StoryCall: I deliver only voice recordings, ",
                                      "not text-to-speech.\n\n",
                                      "Please send that again as an audio attachment."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "3A3",
              "text"               : "Hi Grandma! Miss you. Love you.",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            }
          ]
        },
        {
          "scenario_title"         : "3B Grandma: No answer",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "3B1",
              "text"               : ["Hi Grandma, it's me. Just checking in — hope ",
                                      "your day is going okay."],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "outcome"            : "no_answer",
              "telephone_parts"    : [
                  {
                    "id"              : "3B2",
                    "text"            : "You have a new message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "3B3",
                    "text"            : ["Hi Grandma, it's me. Just checking in — hope ",
                                      "your day is going okay."],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "3B1",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "3B4",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "type"               : "event",
              "id"                 : "3B5",
              "label"              : "Call — No answer",
              "after_utterance_id" : "3B4",
              "before_utterance_id" : "3B6"
            },
            {
              "id"                 : "3B6",
              "text"               : ["StoryCall: Noone answered, so I'll ",
                                      "call back in an hour."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "type"               : "event",
              "id"                 : "3B7",
              "label"              : "1 hour later",
              "seconds"            : 3600,
              "after_utterance_id" : "3B6",
              "before_utterance_id" : "3B8"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 2,
              "outcome"            : "no_answer",
              "telephone_parts"    : [
                  {
                    "id"              : "3B8",
                    "text"            : "You have a new message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "3B9",
                    "text"            : ["Hi Grandma, it's me. Just checking in — hope ",
                                      "your day is going okay."],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "3B1",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "3B10",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "type"               : "event",
              "id"                 : "3B11",
              "label"              : "Call — No answer",
              "seconds"            : 3600,
              "after_utterance_id" : "3B10",
              "before_utterance_id" : "3B12"
            },
            {
              "id"                 : "3B12",
              "text"               : ["StoryCall: I couldn't connect so I'll ",
                                      "try again tomorrow."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "3C Grandma declines",
          "scenario_precursor"     : ["Precursor: Kid has completed onboarding and sent ",
                                      "a voice message. StoryCall calls grandma."],
          "scenario_steps"         : [
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "outcome"            : "declined",
              "telephone_parts"    : [
                  {
                    "id"              : "3C1",
                    "text"            : "You have a new recorded message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "3C2",
                    "text"            : ["Hi Grandma, how are you feeling today?"],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "3C2",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "3C3",
                    "text"            : ["Respond after the beep, or tell me when to ",
                                      "call back with this message."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "3C4",
              "text"               : "Please stop calling this number.",
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "type"               : "event",
              "id"                 : "3C5",
              "label"              : "Call ends — grandma declined"
            },
            {
              "id"                 : "3C6",
              "text"               : ["StoryCall: The person at 212-555-1234 asked us ",
                                      "to stop calling. We won't call that number ",
                                      "again.\n\n",
                                      "To set up a different number, text a new ",
                                      "phone number as audio."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "3D Message queue",
          "scenario_precursor"     : ["Precursor: Kid has completed onboarding. ",
                                      "First message is currently being delivered."],
          "scenario_steps"         : [
            {
              "id"                 : "3D1",
              "text"               : ["What was your favorite thing to cook ",
                                      "when you were young?"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "id"                 : "3D2",
              "text"               : ["StoryCall: Got it. I'm still delivering your ",
                                      "previous message, so this one is queued. ",
                                      "I'll deliver it next."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "type"               : "event",
              "id"                 : "3D3",
              "label"              : "Previous message delivered"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "outcome"            : "answered",
              "telephone_parts"    : [
                  {
                    "id"              : "3D4",
                    "text"            : "You have a new message.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "3D5",
                    "text"            : ["What was your favorite thing to cook ",
                                      "when you were young?"],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "3D1",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "3D6",
                    "text"            : "Respond after the beep.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "3D7",
              "text"               : ["Oh my, I used to make the most wonderful ",
                                      "apple pie. My mother taught me her secret ",
                                      "recipe."],
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "id"                 : "3D8",
              "text"               : ["Oh my, I used to make the most wonderful ",
                                      "apple pie. My mother taught me her secret ",
                                      "recipe."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "audio",
              "derived_from"       : {
                "utterance_id"     : "3D7",
                "kind"             : "relay",
                "via"              : "sms_audio_relay"
              }
            }
          ]
        },
        {
          "scenario_title"         : "3E Wrong attachment",
          "scenario_precursor"     : ["Precursor: Kid has completed onboarding and been ",
                                      "asked to send a voice recording."],
          "scenario_steps"         : [
            {
              "id"                 : "3E1",
              "text"               : "[photo attachment]",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text",
              "mistakes"           : [
                {
                "type"             : "wrong_format",
                "message"          : "Photo sent instead of voice recording"
                }
              ]
            },
            {
              "id"                 : "3E2",
              "text"               : ["StoryCall: I can only deliver voice recordings. ",
                                      "Please send an audio attachment instead of ",
                                      "a photo.\n\n",
                                      "For help recording, text VOICE."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "3E3",
              "text"               : ["Hey Grandma, just wanted to say I love you!"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            }
          ]
        },
        {
          "scenario_title"         : "3F Unclear audio",
          "scenario_precursor"     : ["Precursor: Kid has completed onboarding and been ",
                                      "asked to send a voice recording."],
          "scenario_steps"         : [
            {
              "id"                 : "3F1",
              "text"               : "[inaudible recording]",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio",
              "mistakes"           : [
                {
                "type"             : "audio_quality",
                "message"          : "Recording is too quiet or unclear"
                }
              ]
            },
            {
              "id"                 : "3F2",
              "text"               : ["StoryCall: I received your recording but the ",
                                      "audio is very hard to hear. Could you try ",
                                      "recording again in a quieter place, and speak ",
                                      "a little closer to your phone?\n\n",
                                      "For help recording, text VOICE."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            },
            {
              "id"                 : "3F3",
              "text"               : ["Grandma, do you remember our trip to the lake?"],
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "audio"
            }
          ]
        },
        {
          "scenario_title"         : "3G Grandma calls back",
          "scenario_precursor"     : ["Precursor: StoryCall called grandma but she ",
                                      "missed the call. Grandma sees the missed call ",
                                      "and dials the number back."],
          "scenario_steps"         : [
            {
              "type"               : "event",
              "id"                 : "3G1",
              "label"              : "Grandma calls StoryCall number back"
            },
            {
              "channel"            : "telephone",
              "from"               : "storycall",
              "to"                 : "grandma",
              "speaker"            : "storycall",
              "telephone_index"    : 1,
              "outcome"            : "answered",
              "telephone_parts"    : [
                  {
                    "id"              : "3G2",
                    "text"            : ["Hi, this is StoryCall. You have a recorded ",
                                      "message waiting for you."],
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  },
                  {
                    "id"              : "3G3",
                    "text"            : ["Hey Grandma, I made the honor roll! ",
                                      "I wanted you to be the first to know."],
                    "format"          : "audio",
                    "speaker"         : "kid",
                    "derived_from"    : {
                      "utterance_id"  : "3G3",
                      "kind"          : "relay",
                      "via"           : "telephone_playback"
                    }
                  },
                  {
                    "id"              : "3G4",
                    "text"            : "Respond after the beep.",
                    "format"          : "audio",
                    "speaker"         : "storycall"
                  }
              ]
            },
            {
              "id"                 : "3G5",
              "text"               : ["Oh sweetheart, I am so proud of you! ",
                                      "You worked so hard this semester."],
              "channel"            : "telephone",
              "from"               : "grandma",
              "to"                 : "storycall",
              "format"             : "audio"
            },
            {
              "id"                 : "3G6",
              "text"               : ["Oh sweetheart, I am so proud of you! ",
                                      "You worked so hard this semester."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "audio",
              "derived_from"       : {
                "utterance_id"     : "3G5",
                "kind"             : "relay",
                "via"              : "sms_audio_relay"
              }
            }
          ]
        }
      ]
    },
    {
      "group_title"                : "4 Help",
      "group_scenarios"            : [
        {
          "scenario_title"         : "4A HELP: what to do next (setup)",
          "scenario_precursor"     : ["Precursor: Kid has submitted the keyword ",
                                      "correctly but seems to be having trouble with ",
                                      "setup."],
          "scenario_steps"         : [
            {
              "id"                 : "4A1",
              "text"               : "HELP",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "4A2",
              "text"               : ["StoryCall: Here's what to do:\n",
                                      "1) Text me the phone number I should ",
                                      "call as a voice recording.\n",
                                      "2) After I confirm the number, I'll ",
                                      "deliver any future recordings you enter.\n",
                                      "To change the call-to number later, ",
                                      "just send a new phone number as audio."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "4B VOICE: how to attach a voice recording",
          "scenario_precursor"     : ["Precursor: Kid has submitted the keyword ",
                                      "correctly but seems to be having trouble with ",
                                      "making and sending a voice recording."],
          "scenario_steps"         : [
            {
              "id"                 : "4B1",
              "text"               : "VOICE",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "4B2",
              "text"               : ["StoryCall: No problem. In your texting app:\n",
                                      "- Tap the + or attachment button near ",
                                      "the message box.\n",
                                      "- Choose Audio / Voice / Record.\n",
                                      "- Record your message (or the phone ",
                                      "number), then tap Send.\n",
                                      "Tip: avoid speech-to-text dictation — ",
                                      "I need an actual audio recording."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        }
      ]
    },
    {
      "group_title"                : "5 Texting to stop",
      "group_scenarios"            : [
        {
          "scenario_title"         : "5A STOP: opt out",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "5A1",
              "text"               : "STOP",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "5A2",
              "text"               : ["StoryCall: You have opted out. StoryCall will not ",
                                      "send any calls from this thread.\n",
                                      "If you change your mind, text ",
                                      "'storycall' to restart."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        },
        {
          "scenario_title"         : "5B Restart",
          "scenario_precursor"     : "",
          "scenario_steps"         : [
            {
              "id"                 : "5B1",
              "text"               : "storycall",
              "channel"            : "sms",
              "from"               : "kid",
              "to"                 : "storycall",
              "format"             : "text"
            },
            {
              "id"                 : "5B2",
              "text"               : ["StoryCall: Welcome back.\n\n",
                                      "We removed the phone number you entered before, ",
                                      "so please text me the PHONE NUMBER to deliver ",
                                      "your recording to.\n\n",
                                      "Text STOP or HELP at any time."],
              "channel"            : "sms",
              "from"               : "storycall",
              "to"                 : "kid",
              "format"             : "text"
            }
          ]
        }
      ]
    }
  ]
};
