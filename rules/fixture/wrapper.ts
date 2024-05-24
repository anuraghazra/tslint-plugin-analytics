import analytics from "./track";

// This will be flagged because it's using track
const trackWrapper = () => {
  const ret = {
    track: (name: string) => {
      analytics.track(name);
    },
  };
  return ret;
};

// This will be flagged because it's using track
const trackWrapper2 = (name: string) => {
  analytics.track(name);
};

const thisWillBeFine = (name: string) => {
  console.log(name);
}

export { thisWillBeFine, trackWrapper, trackWrapper2 };
