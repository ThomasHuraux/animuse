import { useEffect, useRef } from 'react';
import { MIDI_LOW, MIDI_HIGH } from '../data/presets';

export function useMIDI(onNoteOn) {
  const callbackRef = useRef(onNoteOn);
  useEffect(() => { callbackRef.current = onNoteOn; }, [onNoteOn]);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported in this browser.');
      return;
    }

    let midiAccess = null;

    const handleMidiMessage = (event) => {
      const [status, note, velocity] = event.data;
      const command = status & 0xf0;
      if (command === 0x90 && velocity > 0 && note >= MIDI_LOW && note <= MIDI_HIGH) {
        callbackRef.current(note - MIDI_LOW);
      }
    };

    const connectInputs = (access) => {
      access.inputs.forEach(input => {
        input.onmidimessage = handleMidiMessage;
      });
    };

    navigator.requestMIDIAccess()
      .then(access => {
        midiAccess = access;
        connectInputs(access);
        access.onstatechange = (event) => {
          if (event.port.type === 'input' && event.port.state === 'connected') {
            event.port.onmidimessage = handleMidiMessage;
          }
        };
      })
      .catch(err => console.warn('MIDI access denied:', err));

    return () => {
      if (midiAccess) {
        midiAccess.inputs.forEach(input => { input.onmidimessage = null; });
        midiAccess.onstatechange = null;
      }
    };
  }, []);
}
