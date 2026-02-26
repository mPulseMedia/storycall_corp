/* scenarios.js — edit directly */
var SCENARIOS_DATA = {
  "schema_version"          : "storycall_scenarios_v1",
  "scenario_ids"            : ["1A","2A","2B","2C","3A","3B","3C","4A","4B","4C","5A","5B"],
  "scenarios"               : {
    "1A"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "1A",
      "title"                 : "1.A. Perfect path",
      "precursor_group"       : ["Precursor: Kid has had no interaction with ",
                                  "StoryCall."],
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "1A1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "storycall"
          },
          {
            "id"                    : "1A2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Hi. StoryCall will convert your voice recordings ",
                                        "into scheduled phone calls.\n\n",
                                        "To begin, text me the PHONE NUMBER to call ",
                                        "with your recording.\n\n",
                                        "Text STOP or HELP at any time."]
          },
          {
            "id"                    : "1A3",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "2125551234"
          },
          {
            "id"                    : "1A4",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["StoryCall: Now SMS me a voice recording ",
                                        "and I'll deliver it to 212-555-1234.\n\n",
                                        "On iOS, tap the the attachment + button and choose Audio, ",
                                        "and on Android, hold down the microphone button.\n\n",
                                        "Text VOICE for help on how to do this."]
          },
          {
            "id"                    : "1A5",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "voice",
            "duration_s"            : 15,
            "text"                  : ["Hi Grandma. Were you popular in high school?"]
          },
          {
            "channel"               : "telephone",
            "from"                  : "storycall",
            "to"                    : "grandma",
            "speaker"               : "storycall",
            "telephone_call_index"  : 1,
            "utterance_ids"         : ["1A6","1A7","1A8"],
            "parts"                 : [
                {
                  "id"                    : "1A6",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : "You have a new recorded message."
                },
                {
                  "id"                    : "1A7",
                  "format"                : "voice",
                  "speaker"               : "kid",
                  "text"                  : ["Hi Grandma. Were you popular in high school?"],
                  "derived_from"          : {
                    "utterance_id"    : "1A5",
                    "kind"            : "relay",
                    "via"             : "telephone_playback"
                  }
                },
                {
                  "id"                    : "1A8",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : ["Respond after the beep, or tell me when to ",
                                              "call back with this message."]
                }
            ]
          },
          {
            "id"                    : "1A9",
            "channel"               : "telephone",
            "from"                  : "grandma",
            "to"                    : "storycall",
            "speaker"               : "grandma",
            "format"                : "voice",
            "text"                  : ["I was in a group of seven girls and we called ",
                                        "ourselves the Cats. I guess we were a little ",
                                        "popular."]
          },
          {
            "id"                    : "1A10",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "voice",
            "duration_s"            : 13,
            "text"                  : ["I was in a group of seven girls and we called ",
                                        "ourselves the Cats. I guess we were a little ",
                                        "popular."],
            "derived_from"          : {
              "utterance_id"    : "1A9",
              "kind"            : "relay",
              "via"             : "sms_audio_relay"
            }
          }
      ]
    },
    "2A"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "2A",
      "title"                 : "2.A. Kid error: incorrect keyword",
      "precursor_group"       : ["Precursor: Kid has had no interaction with ",
                                  "StoryCall."],
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "2A1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "story",
            "mistakes"              : [
              {
              "kind"            : "incorrect_keyword",
              "message"         : "kid texts story"
              }
            ]
          },
          {
            "id"                    : "2A2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Sorry — 'storycall' is the official ",
                                        "keyword.\n\n",
                                        "Please text storycall to officially opt ",
                                        "in and approve receiving messages from me."]
          },
          {
            "id"                    : "2A3",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "storycall"
          },
          {
            "id"                    : "2A4",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Hi. StoryCall will convert your voice recordings ",
                                        "into scheduled phone calls.\n\n",
                                        "To begin, text me the PHONE NUMBER to call ",
                                        "with your recording.\n\n",
                                        "Text STOP or HELP at any time."]
          }
      ]
    },
    "2B"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "2B",
      "title"                 : "2.B. Phone number is incomplete",
      "precursor_group"       : ["Precursor: Kid has had no interaction with ",
                                  "StoryCall."],
      "precursor"             : ["Precursor: Kid has successfully texted the ",
                                  "keyword story call."],
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "2B1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "5551234"
          },
          {
            "id"                    : "2B2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["StoryCall: That doesn't look like a ",
                                        "complete phone number — I need a full ",
                                        "10-digit number including area code.\n\n",
                                        "Please text the phone number again with ",
                                        "the area code (example: 2125551234)."]
          },
          {
            "id"                    : "2B3",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "2125551234"
          },
          {
            "id"                    : "2B4",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["StoryCall: Now SMS me a voice recording ",
                                        "and I'll deliver it to 212-555-1234.\n\n",
                                        "On iOS, tap the the attachment + button and choose Audio, ",
                                        "and on Android, hold down the microphone button.\n\n",
                                        "Text VOICE for help on how to do this."]
          }
      ]
    },
    "2C"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "2C",
      "title"                 : "2.C. Change the call-to number",
      "precursor_group"       : "",
      "precursor"             : ["Precursor: Kid has previously provided the ",
                                  "phone number with area code 415–555–1234."],
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "2C1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : ["Actually from now on, can you deliver my ",
                                        "messages to 650-555-1234"]
          },
          {
            "id"                    : "2C2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Updated — I'll call 650-555-1234",
                                        "with your future messages.\n",
                                        "Next step: send an audio message for ",
                                        "me to deliver."]
          }
      ]
    },
    "3A"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "3A",
      "title"                 : "3.A. Reschedule: call back in about an hour",
      "precursor_group"       : ["Precursor: Kids successfully joined and set ",
                                  "up grandma phone number."],
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "3A1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "voice",
            "duration_s"            : 5,
            "text"                  : ["Hi Grandma — what was it like on Christmas ",
                                        "morning?"]
          },
          {
            "channel"               : "telephone",
            "from"                  : "storycall",
            "to"                    : "grandma",
            "speaker"               : "storycall",
            "telephone_call_index"  : 1,
            "utterance_ids"         : ["3A2","3A3","3A4"],
            "parts"                 : [
                {
                  "id"                    : "3A2",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : "You have a new message."
                },
                {
                  "id"                    : "3A3",
                  "format"                : "voice",
                  "speaker"               : "kid",
                  "text"                  : ["Hi Grandma — what was it like on Christmas ",
                                              "morning?"],
                  "derived_from"          : {
                    "utterance_id"    : "3A1",
                    "kind"            : "relay",
                    "via"             : "telephone_playback"
                  }
                },
                {
                  "id"                    : "3A4",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : ["Respond after the beep, or tell me when to ",
                                              "call back with this message."]
                }
            ]
          },
          {
            "id"                    : "3A5",
            "channel"               : "telephone",
            "from"                  : "grandma",
            "to"                    : "storycall",
            "speaker"               : "grandma",
            "format"                : "voice",
            "text"                  : "Can you call me back in about an hour?"
          },
          {
            "id"                    : "3A6",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : "They asked me to call back in one hour."
          },
          {
            "type"                  : "time_passes",
            "label"                 : "1 hour later",
            "seconds"               : 3600,
            "after_utterance_id"    : "3A6",
            "before_utterance_id"   : "3A7"
          },
          {
            "channel"               : "telephone",
            "from"                  : "storycall",
            "to"                    : "grandma",
            "speaker"               : "storycall",
            "telephone_call_index"  : 2,
            "utterance_ids"         : ["3A7","3A8","3A9"],
            "parts"                 : [
                {
                  "id"                    : "3A7",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : "Calling back with your new message."
                },
                {
                  "id"                    : "3A8",
                  "format"                : "voice",
                  "speaker"               : "kid",
                  "text"                  : ["Hi Grandma — what was it like on Christmas ",
                                              "morning?"],
                  "derived_from"          : {
                    "utterance_id"    : "3A1",
                    "kind"            : "relay",
                    "via"             : "telephone_playback"
                  }
                },
                {
                  "id"                    : "3A9",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : ["Respond after the beep, or tell me when to ",
                                              "call back with this message."]
                }
            ]
          },
          {
            "id"                    : "3A10",
            "channel"               : "telephone",
            "from"                  : "grandma",
            "to"                    : "storycall",
            "speaker"               : "grandma",
            "format"                : "voice",
            "text"                  : ["We got up early and we all sat at the top of ",
                                        "the steps and we opened the stockings first ",
                                        "and then ripped through every present\n",
                                        "and then had brunch and it was wonderful."]
          },
          {
            "id"                    : "3A11",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "voice",
            "duration_s"            : 18,
            "text"                  : ["We got up early and we all sat at the top of ",
                                        "the steps and we opened the stockings first ",
                                        "and then ripped through every present and then ",
                                        "had brunch and it was wonderful."],
            "derived_from"          : {
              "utterance_id"    : "3A10",
              "kind"            : "relay",
              "via"             : "sms_audio_relay"
            }
          },
          {
            "id"                    : "3A12",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["We got up early and we all sat at the top of ",
                                        "the steps and we opened the stockings first ",
                                        "and then ripped through every\n",
                                        "present and then had brunch and it was wonderful."],
            "derived_from"          : {
              "utterance_id"    : "3A10",
              "kind"            : "transcript",
              "via"             : "sms_text_transcript"
            }
          }
      ]
    },
    "3B"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "3B",
      "title"                 : "3.B. kid error: Kid sends text instead of audio",
      "precursor_group"       : ["Precursor: Kids successfully joined and set ",
                                  "up grandma phone number."],
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "3B1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "Hi Grandma! Miss you. ❤️"
          },
          {
            "id"                    : "3B2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["StoryCall: I deliver voice recordings, ",
                                        "not text-to-speech.\n\n",
                                        "Please send that again as an audio attachment."]
          },
          {
            "id"                    : "3B3",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "voice",
            "duration_s"            : 4,
            "text"                  : "Hi Grandma! Miss you. Love you."
          }
      ]
    },
    "3C"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "3C",
      "title"                 : "3.C. No answer / voicemail / retry",
      "precursor_group"       : ["Precursor: Kids successfully joined and set ",
                                  "up grandma phone number."],
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "3C1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "voice",
            "duration_s"            : 7,
            "text"                  : ["Hi Grandma, it's me. Just checking in — hope ",
                                        "your day is going okay."]
          },
          {
            "channel"               : "telephone",
            "from"                  : "storycall",
            "to"                    : "grandma",
            "speaker"               : "storycall",
            "telephone_call_index"  : 1,
            "outcome"               : "no_answer",
            "utterance_ids"         : ["3C2","3C3","3C4"],
            "parts"                 : [
                {
                  "id"                    : "3C2",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : "You have a new message."
                },
                {
                  "id"                    : "3C3",
                  "format"                : "voice",
                  "speaker"               : "kid",
                  "text"                  : ["Hi Grandma, it's me. Just checking in — hope ",
                                              "your day is going okay."],
                  "derived_from"          : {
                    "utterance_id"    : "3C1",
                    "kind"            : "relay",
                    "via"             : "telephone_playback"
                  }
                },
                {
                  "id"                    : "3C4",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : ["Respond after the beep, or tell me when to ",
                                              "call back with this message."]
                }
            ]
          },
          {
            "type"                  : "time_passes",
            "label"                 : "No answer — 1 hour later",
            "seconds"               : 3600,
            "after_utterance_id"    : "3C4",
            "before_utterance_id"   : "3C5"
          },
          {
            "channel"               : "telephone",
            "from"                  : "storycall",
            "to"                    : "grandma",
            "speaker"               : "storycall",
            "telephone_call_index"  : 2,
            "outcome"               : "no_answer",
            "utterance_ids"         : ["3C5","3C6","3C7"],
            "parts"                 : [
                {
                  "id"                    : "3C5",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : "You have a new message."
                },
                {
                  "id"                    : "3C6",
                  "format"                : "voice",
                  "speaker"               : "kid",
                  "text"                  : ["Hi Grandma, it's me. Just checking in — hope ",
                                              "your day is going okay."],
                  "derived_from"          : {
                    "utterance_id"    : "3C1",
                    "kind"            : "relay",
                    "via"             : "telephone_playback"
                  }
                },
                {
                  "id"                    : "3C7",
                  "format"                : "voice",
                  "speaker"               : "storycall",
                  "text"                  : ["Respond after the beep, or tell me when to ",
                                              "call back with this message."]
                }
            ]
          },
          {
            "type"                  : "time_passes",
            "label"                 : "No answer — 1 hour later",
            "seconds"               : 3600,
            "after_utterance_id"    : "3C7",
            "before_utterance_id"   : "3C8"
          },
          {
            "id"                    : "3C8",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["StoryCall: I could not reach them and will ",
                                        "try again tomorrow."]
          }
      ]
    },
    "4A"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "4A",
      "title"                 : "4.A. HELP: what to do next (setup)",
      "precursor_group"       : "",
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "4A1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "HELP"
          },
          {
            "id"                    : "4A2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Here's what to do:\n",
                                        "1) Text me the phone number I should ",
                                        "call as a voice recording.\n",
                                        "2) After I confirm the number, I'll ",
                                        "deliver any future recordings you enter.\n",
                                        "To change the call-to number later, ",
                                        "just send a new phone number as audio."]
          }
      ]
    },
    "4B"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "4B",
      "title"                 : "4.B. HELP: how to attach a voice recording",
      "precursor_group"       : "",
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "4B1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "HELP I can't figure out the audio thing"
          },
          {
            "id"                    : "4B2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["No problem. In your texting app:\n",
                                        "- Tap the + or attachment button near ",
                                        "the message box.\n",
                                        "- Choose Audio / Voice / Record.\n",
                                        "- Record your message (or the phone ",
                                        "number), then tap Send.\n",
                                        "Tip: avoid speech-to-text dictation — ",
                                        "I need an actual audio recording."]
          }
      ]
    },
    "4C"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "4C",
      "title"                 : "4.C. HELP: change the number",
      "precursor_group"       : "",
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "4C1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "HELP I need to change who you call"
          },
          {
            "id"                    : "4C2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["To change the call-to number, send the ",
                                        "new phone number as an audio recording.\n",
                                        "After I confirm it, I'll use that new ",
                                        "number for your future messages."]
          }
      ]
    },
    "5A"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "5A",
      "title"                 : "5.A. STOP: opt out",
      "precursor_group"       : "",
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "5A1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "STOP"
          },
          {
            "id"                    : "5A2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Kid is opted out. StoryCall will not ",
                                        "send any calls from this thread.\n",
                                        "If Kid changes their mind, text ",
                                        "storycall to start again."]
          }
      ]
    },
    "5B"                    : {
      "schema_version"        : "storycall_scenario_jason_v1",
      "scenario_id"           : "5B",
      "title"                 : "5.B. Restart after STOP",
      "precursor_group"       : "",
      "precursor"             : "",
      "participants"          : ["kid","storycall","grandma"],
      "steps"                 : [
          {
            "id"                    : "5B1",
            "channel"               : "sms",
            "from"                  : "kid",
            "to"                    : "storycall",
            "format"                : "text",
            "text"                  : "storycall"
          },
          {
            "id"                    : "5B2",
            "channel"               : "sms",
            "from"                  : "storycall",
            "to"                    : "kid",
            "format"                : "text",
            "text"                  : ["Welcome back. If you haven't set a ",
                                        "call-to number yet, send it now as an ",
                                        "audio recording.\n",
                                        "Otherwise, send your next message as ",
                                        "audio and I'll call it through."]
          }
      ]
    }
  }
};
