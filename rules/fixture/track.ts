// Pretend this is a library function
const track = (_name: string) => {}

const analytics = {
  track,
  track_EXPERIMENTAL: (name: string) => {
    console.log(name);
  },
}

export default analytics;