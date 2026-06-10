/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findCssClassesLazy } from "@webpack";
import definePlugin from "@utils/types";
import { FluxDispatcher, React, useEffect, useState } from "@webpack/common";

import { RTCConnectionStore } from "./stores";

function InlinePingText({ text }: { text: string }) {
  const [ping, setPing] = useState(() => RTCConnectionStore.getLastPing());

  useEffect(() => {
    const update = () => setPing(RTCConnectionStore.getLastPing());
    FluxDispatcher.subscribe("RTC_CONNECTION_PING", update);
    return () => FluxDispatcher.unsubscribe("RTC_CONNECTION_PING", update);
  }, []);

  return <>{ping !== undefined ? `${text} - ${ping} ms` : text}</>;
}

const classes = findCssClassesLazy("container", "voiceUsers", "channel");
let oldContainer: string;

export default definePlugin({
  name: "ShowPing",
  description: "Displays your live ping.",
  authors: [
    {
      name: "nicola02nb",
      id: 257900031351193600n,
    },
    { name: "__azuree__", id: 451657007791996929n },
  ],
  patches: [
    {
      find: "IlHdW8",
      replacement: {
        match: /color:"currentColor",children:(\i)(\}\)\}\))/,
        replace: 'color:"currentColor",children:$self.appendPing($1)$2',
      },
    },
  ],
  start: () => {
    oldContainer = classes.container;
    classes.container += " vc-connection-container";
  },
  stop: () => {
    classes.container = oldContainer;
  },

  appendPing(text: string) {
    return <InlinePingText text={text} />;
  },
});
