#!/usr/bin/env python3
"""Transform scenarios.html: add Perfect run section, renumber scenarios."""

import re
import sys

with open("scenarios.html", "r") as f:
    content = f.read()

# ── Step 1: Rename scenario IDs in reverse order ─────────────────────

renames = [
    ("4B", "5B"), ("4A", "5A"),
    ("3C", "4C"), ("3B", "4B"), ("3A", "4A"),
    ("2D", "3C"), ("2C", "3B"), ("2B", "3A"),
    ("1E", "2D"), ("1D", "2C"), ("1C", "2B"), ("1B", "2A"),
]

for old_id, new_id in renames:
    od = f"{old_id[0]}.{old_id[1]}."   # e.g. "1.B."
    nd = f"{new_id[0]}.{new_id[1]}."   # e.g. "2.A."
    oa = f"{old_id[0]}.{old_id[1]}"    # e.g. "1.B"  (aria)
    na = f"{new_id[0]}.{new_id[1]}"    # e.g. "2.A"

    content = content.replace(
        f'storycall_scenario_jason_{old_id}',
        f'storycall_scenario_jason_{new_id}')
    content = content.replace(
        f'"scenario_id"      : "{old_id}"',
        f'"scenario_id"      : "{new_id}"')
    content = content.replace(
        f'"title"            : "{od}',
        f'"title"            : "{nd}')
    content = content.replace(
        f'<h3 id="{old_id}">{od}',
        f'<h3 id="{new_id}">{nd}')
    content = content.replace(
        f'href="#{old_id}"', f'href="#{new_id}"')
    content = content.replace(
        f'data-scenario_id="{old_id}"',
        f'data-scenario_id="{new_id}"')
    content = content.replace(
        f'scenario {oa}', f'scenario {na}')
    content = content.replace(
        f'v2 {oa} diagram', f'v2 {na} diagram')
    content = content.replace(
        f'meta.scenario_id === "{old_id}"',
        f'meta.scenario_id === "{new_id}"')
    # 2B's special diagram label
    if old_id == "2B":
        content = content.replace(
            '2.B2 seven-column diagram',
            '3.A2 seven-column diagram')
    # grid7_b2 CSS class references → grid7_b3a  (for old 2B → 3A)
    if old_id == "2B":
        content = content.replace('grid7_b2_', 'grid7_b3a_')

print("Step 1 done: 12 renames applied")

# ── Step 2: Update scenario_ids array ────────────────────────────────

content = content.replace(
    '"scenario_ids"               : '
    '["1A", "1B", "1C", "1D", "1E", '
    '"2A", "2B", "2C", "2D", '
    '"3A", "3B", "3C", '
    '"4A", "4B"]',
    '"scenario_ids"               : '
    '["1A", "2A", "2B", "2C", "2D", '
    '"3A", "3B", "3C", '
    '"4A", "4B", "4C", '
    '"5A", "5B"]'
)
print("Step 2 done: scenario_ids updated")

# ── Step 3: Replace old 1A JSON with merged 1A JSON ─────────────────

# Find the old 1A JSON block (still has id="storycall_scenario_jason_1A")
old_1a_start_marker = '    <script type="application/json" id="storycall_scenario_jason_1A">\n'
idx_1a = content.find(old_1a_start_marker)
if idx_1a == -1:
    print("ERROR: old 1A JSON block not found")
    sys.exit(1)

idx_1a_end = content.find('\n    </script>', idx_1a) + len('\n    </script>')
old_1a_block = content[idx_1a:idx_1a_end]

new_1a_json = r'''    <script type="application/json" id="storycall_scenario_jason_1A">
{
  "schema_version"   : "storycall_scenario_jason_v1",
  "scenario_id"      : "1A",
  "title"            : "1.A. Perfect run",
  "precursor_group"  : "Precursor: Kid has had no interaction with StoryCall.",
  "precursor"        : "",
  "participants"     : [
    "kid",
    "storycall",
    "grandma"
  ],
  "steps"            : [
    {
      "id"           : 1,
      "channel"      : "sms",
      "speaker"      : "kid",
      "format"       : "text",
      "text"         : "storycall"
    },
    {
      "id"           : 2,
      "channel"      : "sms",
      "speaker"      : "storycall",
      "format"       : "voice",
      "duration_s"   : 18,
      "text"         : "Welcome to StoryCall, where we deliver your voice recordings as phone calls. Text STOP or HELP at any time.\n\nTo begin, tell us the phone number we should call with your messages.\n\nTap the attachment button in the bottom left corner of your text app. Make a new voice recording of that phone number and send it to us."
    },
    {
      "id"           : 3,
      "channel"      : "sms",
      "speaker"      : "kid",
      "format"       : "voice",
      "duration_s"   : 4,
      "text"         : "Call four one five, five five five, one two three four."
    },
    {
      "id"           : 4,
      "channel"      : "sms",
      "speaker"      : "storycall",
      "format"       : "text",
      "text"         : "Great \u2014 we\u2019ll call 415-555-1234 with your future messages. If that\u2019s not correct, send another audio message with the\nright number.\n\nFrom now on, whenever Kid sends an audio message to StoryCall, we\u2019ll call 415-555-1234 and play Kid\u2019s recording.\nWe\u2019ll send you any reply as a text in this same thread.\n\nKid can text HELP or STOP anytime. Kid can also text the StoryCall Admin directly here (plain text)."
    },
    {
      "id"           : 5,
      "channel"      : "sms",
      "speaker"      : "kid",
      "format"       : "voice",
      "duration_s"   : 5,
      "text"         : "Hey Grandma \u2014 what music was popular when you were in high school?"
    },
    {
      "channel"                  : "telephone",
      "from"                     : "storycall",
      "to"                       : "grandma",
      "speaker"                  : "storycall",
      "telephone_call_index"     : 1,
      "utterance_ids"            : [
        6,
        7,
        8
      ],
      "parts"                    : [
        {
          "id"                   : 6,
          "format"               : "voice",
          "speaker"              : "storycall",
          "text"                 : "Grandma has a new message."
        },
        {
          "id"                   : 7,
          "format"               : "voice",
          "speaker"              : "kid",
          "text"                 : "Hey grandma \u2013 what music was popular when you were in high school?",
          "derived_from"         : {
            "utterance_id"       : 5,
            "kind"              : "relay",
            "via"               : "telephone_playback"
          }
        },
        {
          "id"                   : 8,
          "format"               : "voice",
          "speaker"              : "storycall",
          "text"                 : "Please reply after the beep or tell me to call back and play your message another time."
        }
      ]
    },
    {
      "id"           : 9,
      "channel"      : "telephone",
      "speaker"      : "grandma",
      "format"       : "voice",
      "text"         : "We listen to Frank Sinatra, and Sam Cooke all the time."
    },
    {
      "id"           : 10,
      "channel"      : "sms",
      "speaker"      : "storycall",
      "format"       : "voice",
      "duration_s"   : 13,
      "text"         : "We listen to Frank Sinatra, and Sam Cooke all the time.",
      "derived_from" : {
        "utterance_id": 9,
        "kind"        : "relay",
        "via"         : "sms_audio_relay"
      }
    },
    {
      "id"           : 11,
      "channel"      : "sms",
      "speaker"      : "storycall",
      "format"       : "text",
      "text"         : "We listen to Frank Sinatra, and Sam Cooke all the time.",
      "derived_from" : {
        "utterance_id": 9,
        "kind"        : "transcript",
        "via"         : "sms_text_transcript"
      }
    }
  ]
}
    </script>'''

content = content.replace(old_1a_block, new_1a_json)
print("Step 3a done: old 1A replaced with merged 1A")

# ── Step 3b: Remove old 2A JSON block ────────────────────────────────
# After renames, old 2A is still "2A" but old 1B was renamed TO "2A".
# We need to remove the SECOND occurrence of storycall_scenario_jason_2A
# which is the old "Audio question + audio reply" block.
# Actually - old 2A wasn't renamed. It still says "2A" with "Audio question"
# title. We need to find and remove it.

# The old 2A had title "2.A. Audio question + audio reply"
# But wait - the rename from 1B to 2A already happened. So old 1B now has
# the id storycall_scenario_jason_2A too. There are now TWO blocks with 2A.
# The old 2A (Audio question) needs to be removed.

# Find it by its unique content
audio_q_marker = 'Audio question + audio reply'
idx = content.find(audio_q_marker)
if idx == -1:
    print("WARNING: Old 2A 'Audio question' block not found")
else:
    # Search backwards for the <script tag
    script_start = content.rfind(
        '<script type="application/json"', 0, idx)
    if script_start == -1:
        print("ERROR: Could not find script tag for old 2A")
    else:
        script_end = content.find('</script>', idx) + len('</script>')
        # Include leading whitespace (find start of line)
        line_start = content.rfind('\n', 0, script_start)
        if line_start == -1:
            line_start = script_start
        # Remove the block plus surrounding newlines
        before = content[:line_start]
        after = content[script_end:]
        # Strip one leading newline from after if present
        if after.startswith('\n'):
            after = after[1:]
        content = before + after
        print("Step 3b done: old 2A JSON block removed")

# ── Step 4: Update section group headers ─────────────────────────────

# Rename section h2 headers (reverse order to avoid conflicts)
# old id="4" → id="5"
content = content.replace(
    '<h2 class="group_title" id="4">4. Texting to stop</h2>',
    '<h2 class="group_title" id="5">5. Texting to stop</h2>')
# old id="3" → id="4"
content = content.replace(
    '<h2 class="group_title" id="3">3. Texting for help</h2>',
    '<h2 class="group_title" id="4">4. Texting for help</h2>')
# old id="2" → id="3"
content = content.replace(
    '<h2 class="group_title" id="2">2. Message exchange</h2>',
    '<h2 class="group_title" id="3">3. Message exchange</h2>')
# old id="1" → id="2"
content = content.replace(
    '<h2 class="group_title" id="1">1. Kids successfully set up</h2>',
    '<h2 class="group_title" id="2">2. Kids successfully set up</h2>')

print("Step 4 done: section headers renumbered")

# ── Step 5: Update outline ───────────────────────────────────────────

old_outline = '''      <div class="scenario_list" aria-label="Outline">
        <ol>
          <li>
            <a href="#1">Kids successfully set up</a>
            <ol type="A">
              <li><a href="#2A">Successful setup</a></li>
              <li><a href="#2A">Kid error: incorrect keyword</a></li>
              <li><a href="#2B">Kid error: phone number sent as text</a></li>
              <li><a href="#2C">Phone number audio is unclear / incomplete</a></li>
              <li><a href="#2D">Change the call-to number</a></li>
            </ol>
          </li>
          <li>
            <a href="#2">Message exchange</a>
            <ol type="A">
              <li><a href="#2A">Audio question + audio reply</a></li>
              <li><a href="#3A">Reschedule: call back in about an hour</a></li>
              <li><a href="#3B">kid error: Kid sends text instead of audio</a></li>
              <li><a href="#3C">No answer / voicemail / retry</a></li>
            </ol>
          </li>
          <li>
            <a href="#3">Texting for help</a>
            <ol type="A">
              <li><a href="#4A">HELP: what to do next (setup)</a></li>
              <li><a href="#4B">HELP: how to attach a voice recording</a></li>
              <li><a href="#4C">HELP: change the number</a></li>
            </ol>
          </li>
          <li>
            <a href="#4">Texting to stop</a>
            <ol type="A">
              <li><a href="#5A">STOP: opt out</a></li>
              <li><a href="#5B">Restart after STOP</a></li>
            </ol>
          </li>
        </ol>
      </div>'''

new_outline = '''      <div class="scenario_list" aria-label="Outline">
        <ol>
          <li>
            <a href="#1">Perfect run</a>
            <ol type="A">
              <li><a href="#1A">Perfect run</a></li>
            </ol>
          </li>
          <li>
            <a href="#2">Kids successfully set up</a>
            <ol type="A">
              <li><a href="#2A">Kid error: incorrect keyword</a></li>
              <li><a href="#2B">Kid error: phone number sent as text</a></li>
              <li><a href="#2C">Phone number audio is unclear / incomplete</a></li>
              <li><a href="#2D">Change the call-to number</a></li>
            </ol>
          </li>
          <li>
            <a href="#3">Message exchange</a>
            <ol type="A">
              <li><a href="#3A">Reschedule: call back in about an hour</a></li>
              <li><a href="#3B">kid error: Kid sends text instead of audio</a></li>
              <li><a href="#3C">No answer / voicemail / retry</a></li>
            </ol>
          </li>
          <li>
            <a href="#4">Texting for help</a>
            <ol type="A">
              <li><a href="#4A">HELP: what to do next (setup)</a></li>
              <li><a href="#4B">HELP: how to attach a voice recording</a></li>
              <li><a href="#4C">HELP: change the number</a></li>
            </ol>
          </li>
          <li>
            <a href="#5">Texting to stop</a>
            <ol type="A">
              <li><a href="#5A">STOP: opt out</a></li>
              <li><a href="#5B">Restart after STOP</a></li>
            </ol>
          </li>
        </ol>
      </div>'''

content = content.replace(old_outline, new_outline)
print("Step 5 done: outline updated")

# ── Step 6: Update outline section hrefs ─────────────────────────────
# The section-level hrefs (#1, #2, #3, #4) also need renumbering in outline
# But we already did this in the new_outline above.
# However, we also need to update the section-level hrefs in the group headers
# The h2 href="#X" references in the outline were already updated.

# ── Step 7: Replace old 1A HTML section + old 2A HTML section ────────
# with new merged 1A HTML section, and add new section 1 header

# Find the old section group 1 start
old_section1_start = '    <section class="group">\n      <h2 class="group_title" id="2">2. Kids successfully set up</h2>'
idx_s1 = content.find(old_section1_start)
if idx_s1 == -1:
    print("ERROR: Could not find section group 1 (now renumbered to 2)")
    sys.exit(1)

# Find the old 1A HTML scenario section within it
# It starts with <section class="scenario"> followed by <h3 id="1A">
old_1a_html_start = '      <section class="scenario">\n        <h3 id="1A">'
idx_1a_html = content.find(old_1a_html_start, idx_s1)
if idx_1a_html == -1:
    print("ERROR: Could not find old 1A HTML section")
    sys.exit(1)

# Find the end of old 1A HTML section (closing </section>)
# Need to find the matching </section> - it's the scenario section
# Look for next <section class="scenario"> or </section> of group
next_scenario = content.find('      <section class="scenario">', idx_1a_html + 10)
old_1a_html_end = content.rfind('      </section>\n', idx_1a_html, next_scenario)
if old_1a_html_end == -1:
    print("ERROR: Could not find end of old 1A HTML section")
    sys.exit(1)
old_1a_html_end += len('      </section>\n')

old_1a_html = content[idx_1a_html:old_1a_html_end]

# Now create the new section 1 "Perfect run" group with merged 1A
# and remove old 1A from section 2
new_perfect_run_section = '''    <section class="group">
      <h2 class="group_title" id="1">1. Perfect run</h2>
      <p class="group_precursor">Precursor: Kid has had no interaction with StoryCall.</p>

      <section class="scenario">
        <h3 id="1A">1.A. Perfect run <a class="back_to_outline" href="#outline" aria-label="Back to outline">\u2191</a></h3>
        <p class="scenario_precursor"></p>
        <div class="scenario_jason_inline is_closed" data-scenario_id="1A">
          <script type="application/json" class="scenario_jason_payload" data-scenario_id="1A"></script>
          <pre aria-label="Jason (JSON) description of scenario 1.A"><code></code></pre>
        </div>
        <div class="grid7_diagram" aria-label="v2 1.A diagram">
          <div class="grid7_guides" aria-hidden="true"><div class="grid7_guide"></div><div class="grid7_guide"></div><div class="grid7_guide"></div><div class="grid7_guide"></div><div class="grid7_guide"></div><div class="grid7_guide"></div><div class="grid7_guide"></div></div>
          <div class="grid7_mobile_canvas" aria-hidden="true" style="grid-column: 2 / 6; grid-row: 2 / 13;"></div>

          <div class="grid7_cell grid7_head grid7_head_id" style="grid-column: 1;">ID</div>
          <div class="grid7_cell grid7_head" style="grid-column: 2;">kid</div>
          <div class="grid7_cell grid7_head" style="grid-column: 3;">storycall</div>
          <div class="grid7_cell grid7_head" style="grid-column: 4;">storycall</div>
          <div class="grid7_cell grid7_head" style="grid-column: 5;" aria-label="reserved column">&#8203;</div>
          <div class="grid7_cell grid7_head" style="grid-column: 6;">storycall</div>
          <div class="grid7_cell grid7_head" style="grid-column: 7;">grandma</div>

          <div class="grid7_cell grid7_id" style="grid-row: 2;">1</div>
          <div class="grid7_timestamp" style="grid-column: 5; grid-row: 2; align-self: start; justify-self: start; margin-top: var(--grid7_inset);">1:00:00</div>
          <div class="grid7_block channel_sms participant_kid format_text" style="grid-column: 2 / 5; grid-row: 2; margin-top: var(--grid7_inset);">storycall</div>

          <div class="grid7_cell grid7_id" style="grid-row: 3;">2</div>
          <div class="grid7_timestamp" style="grid-column: 2; grid-row: 3; align-self: start; justify-self: end; margin-top: var(--grid7_inset);">1:00:03</div>
          <div class="grid7_block channel_sms participant_storycall format_voice" style="grid-column: 3 / 6; grid-row: 3; margin-top: var(--grid7_inset);">
            <div class="grid7_audio" aria-label="Audio file">
              <div class="grid7_audio_play" aria-hidden="true">\u25b6</div>
              <div class="grid7_audio_waveform" aria-hidden="true"></div>
              <div class="grid7_audio_duration">0:18</div>
            </div>
            <div class="grid7_audio_transcript">
              Welcome to StoryCall, where we deliver your voice recordings as phone calls. Text STOP or HELP at any time.
              <br><br>
              To begin, tell us the phone number we should call with your messages.
              <br><br>
              Tap the attachment button in the bottom left corner of your text app. Make a new voice recording of that phone number and send it to us.
            </div>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 4;">3</div>
          <div class="grid7_timestamp" style="grid-column: 5; grid-row: 4; align-self: start; justify-self: start; margin-top: var(--grid7_inset);">1:00:35</div>
          <div class="grid7_block channel_sms participant_kid format_voice" style="grid-column: 2 / 5; grid-row: 4; margin-top: var(--grid7_inset);">
            <div class="grid7_audio" aria-label="Audio file">
              <div class="grid7_audio_play" aria-hidden="true">\u25b6</div>
              <div class="grid7_audio_waveform" aria-hidden="true"></div>
              <div class="grid7_audio_duration">0:04</div>
            </div>
            <div class="grid7_audio_transcript">Call four one five, five five five, one two three four.</div>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 5;">4</div>
          <div class="grid7_timestamp" style="grid-column: 2; grid-row: 5; align-self: start; justify-self: end; margin-top: var(--grid7_inset);">1:00:40</div>
          <div class="grid7_block channel_sms participant_storycall format_text" style="grid-column: 3 / 6; grid-row: 5; margin-top: var(--grid7_inset);">
            <p>
              Great \u2014 we\u2019ll call <b>415-555-1234</b> with your future messages. If that\u2019s not correct, send another audio message with the
              right number.
            </p>
            <p style="margin-top: var(--space_micro);">
              From now on, whenever Kid sends an <b>audio</b> message to StoryCall, we\u2019ll call <b>415-555-1234</b> and play Kid\u2019s recording.
              We\u2019ll send you any reply as a text in this same thread.
            </p>
            <p style="margin-top: var(--space_micro);">
              Kid can text <b>HELP</b> or <b>STOP</b> anytime. Kid can also text the <b>StoryCall Admin</b> directly here (plain text).
            </p>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 6;">5</div>
          <div class="grid7_timestamp" style="grid-column: 5; grid-row: 6; align-self: start; justify-self: start; margin-top: var(--grid7_inset);">1:01:00</div>
          <div class="grid7_block channel_sms participant_kid format_voice" style="grid-column: 2 / 5; grid-row: 6; margin-top: var(--grid7_inset);">
            <div class="grid7_audio" aria-label="Audio file">
              <div class="grid7_audio_play" aria-hidden="true">\u25b6</div>
              <div class="grid7_audio_waveform" aria-hidden="true"></div>
              <div class="grid7_audio_duration">0:05</div>
            </div>
            <div class="grid7_audio_transcript">Hey Grandma \u2014 what music was popular when you were in high school?</div>
          </div>

          <div class="grid7_phone_bg" aria-hidden="true" style="grid-column: 4 / 8; grid-row: 7 / 11;"></div>

          <!-- Phone prompt split into 3 segments (blue / green / blue) -->
          <div class="grid7_cell grid7_id" style="grid-row: 7;">6</div>
          <div class="grid7_timestamp" style="grid-column: 7; grid-row: 7; align-self: start; justify-self: start; color: rgba(255,255,255,.38); margin-top: var(--grid7_inset);">1:02:05</div>
          <div class="grid7_phone_msg channel_phone participant_storycall format_voice" style="grid-column: 4 / 7; grid-row: 7; margin-top: var(--grid7_inset); border-top-left-radius: 14px; border-top-right-radius: 14px;">
            <p>Grandma has a new message.</p>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 8;">7</div>
          <div class="grid7_timestamp" style="grid-column: 7; grid-row: 8; align-self: start; justify-self: start; color: rgba(255,255,255,.38); margin-top: calc(-1 * var(--grid7_row_gap));">1:02:06</div>
          <div class="grid7_phone_msg channel_phone participant_kid format_voice" style="grid-column: 4 / 7; grid-row: 8; margin-top: calc(-1 * var(--grid7_row_gap));">
            <p>Hey grandma \u2013 what music was popular when you were in high school?</p>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 9;">8</div>
          <div class="grid7_timestamp" style="grid-column: 7; grid-row: 9; align-self: start; justify-self: start; color: rgba(255,255,255,.38); margin-top: calc(-1 * var(--grid7_row_gap));">1:02:07</div>
          <div class="grid7_phone_msg channel_phone participant_storycall format_voice" style="grid-column: 4 / 7; grid-row: 9; margin-top: calc(-1 * var(--grid7_row_gap)); border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;">
            <p>Please reply after the beep or tell me to call back and play your message another time.</p>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 10;">9</div>
          <div class="grid7_timestamp" style="grid-column: 4; grid-row: 10; align-self: start; justify-self: end; color: rgba(255,255,255,.38);">1:02:10</div>
          <div class="grid7_phone_msg channel_phone participant_grandma format_voice" style="grid-column: 5 / 8; grid-row: 10; border-radius: 14px; margin-bottom: var(--grid7_inset);">
            We listen to Frank Sinatra, and Sam Cooke all the time.
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 11;">10</div>
          <div class="grid7_timestamp" style="grid-column: 2; grid-row: 11; align-self: start; justify-self: end; margin-top: var(--grid7_inset);">1:03:10</div>
          <div class="grid7_block channel_sms participant_grandma format_voice" style="grid-column: 3 / 6; grid-row: 11; margin-top: var(--grid7_inset); margin-bottom: var(--grid7_inset);">
            <div class="grid7_audio" aria-label="Audio file">
              <div class="grid7_audio_play" aria-hidden="true">\u25b6</div>
              <div class="grid7_audio_waveform" aria-hidden="true"></div>
              <div class="grid7_audio_duration">0:13</div>
            </div>
            <div class="grid7_audio_transcript" style="display:none;">We listen to Frank Sinatra, and Sam Cooke all the time.</div>
          </div>

          <div class="grid7_cell grid7_id" style="grid-row: 12;">11</div>
          <div class="grid7_block channel_sms participant_grandma format_text" style="grid-column: 3 / 6; grid-row: 12; margin-top: var(--grid7_inset); margin-bottom: var(--grid7_inset);">
            We listen to Frank Sinatra, and Sam Cooke all the time.
          </div>
        </div>
      </section>
    </section>

'''

# Replace old 1A HTML section with new perfect run section + start of section 2
content = content[: idx_1a_html] + content[old_1a_html_end:]

# Now insert the new perfect run section before section 2
idx_section2 = content.find(
    '    <section class="group">\n'
    '      <h2 class="group_title" id="2">2. Kids successfully set up</h2>')
if idx_section2 == -1:
    print("ERROR: Could not find section 2 insertion point")
    sys.exit(1)

content = content[:idx_section2] + new_perfect_run_section + content[idx_section2:]
print("Step 7a done: new Perfect run section inserted, old 1A removed")

# ── Step 8: Remove old 2A HTML section ───────────────────────────────
# After renames, old 2A HTML is now in section 3 (Message exchange)
# But wait - old 2A HTML was NOT renamed (only scenarios 1B-4B were renamed).
# The old 2A HTML section should still have <h3 id="2A">2.A. Audio question
# But 1B was renamed to 2A, so there are now TWO h3 id="2A" elements!
# We need to find the one in section 3 "Message exchange" that has
# "Audio question + audio reply" in its title.

# Find the "Audio question + audio reply" h3
audio_q_h3 = 'Audio question + audio reply'
idx_audio_q = content.find(audio_q_h3)
if idx_audio_q == -1:
    print("WARNING: Old 2A HTML 'Audio question' section not found")
else:
    # Find the enclosing <section class="scenario">
    section_start = content.rfind('<section class="scenario">', 0, idx_audio_q)
    if section_start == -1:
        print("ERROR: Could not find scenario section for old 2A HTML")
    else:
        # Find the matching </section>
        # Count nesting levels
        depth = 0
        i = section_start
        section_end = -1
        while i < len(content):
            if content[i:i+8] == '<section':
                depth += 1
            elif content[i:i+10] == '</section>':
                depth -= 1
                if depth == 0:
                    section_end = i + len('</section>')
                    break
            i += 1

        if section_end == -1:
            print("ERROR: Could not find end of old 2A HTML section")
        else:
            # Find the start of the line
            line_start = content.rfind('\n', 0, section_start) + 1
            # Find end including trailing newline
            if content[section_end:section_end+1] == '\n':
                section_end += 1

            content = content[:line_start] + content[section_end:]
            print("Step 8 done: old 2A HTML section removed")

# ── Step 9: Fix section href references in outline ───────────────────
# Already handled in new_outline above.

# ── Step 10: Fix precursor text for section 2 (was section 1) ────────
# The group_precursor for "Kids successfully set up" should be unchanged.

# ── Step 11: Fix precursor text for section 3 (was section 2) ────────
# Already correct from the original.

# ── Step 12: Also remove old 1A entry from section 2 outline ─────────
# Already handled in new_outline above since we replaced the entire outline.

# ── Verify ───────────────────────────────────────────────────────────
print("\n--- Verification ---")

# Check for duplicate IDs
import re as re_mod
h3_ids = re_mod.findall(r'<h3 id="([^"]+)"', content)
seen = set()
for hid in h3_ids:
    if hid in seen:
        print(f"WARNING: Duplicate h3 id: {hid}")
    seen.add(hid)

h2_ids = re_mod.findall(r'<h2[^>]+id="([^"]+)"', content)
for hid in h2_ids:
    if hid in seen:
        print(f"WARNING: Duplicate section id: {hid}")
    seen.add(hid)

json_ids = re_mod.findall(
    r'id="storycall_scenario_jason_([^"]+)"', content)
json_seen = set()
for jid in json_ids:
    if jid in json_seen:
        print(f"WARNING: Duplicate JSON block id: {jid}")
    json_seen.add(jid)

# Check expected IDs exist
expected = ['1A','2A','2B','2C','2D','3A','3B','3C','4A','4B','4C','5A','5B']
for eid in expected:
    if eid not in json_seen:
        print(f"WARNING: Missing JSON block for {eid}")
    if eid not in seen:
        print(f"WARNING: Missing h3 for {eid}")

# Check section IDs
for sid in ['1','2','3','4','5']:
    if sid not in seen and f'id="{sid}"' not in content:
        count = content.count(f'id="{sid}"')
        if count == 0:
            print(f"WARNING: Missing section id {sid}")

print(f"Total h3 IDs: {len(h3_ids)}")
print(f"Total JSON blocks: {len(json_ids)}")
print("All done!")

with open("scenarios.html", "w") as f:
    f.write(content)
