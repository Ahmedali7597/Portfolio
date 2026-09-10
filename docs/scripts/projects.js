// Project stories use native details and video controls; these listeners add sensible cleanup.
export function initProjects() {
  const videos = [...document.querySelectorAll("[data-video]")];
  // Avoid competing audio when a visitor starts a second recording.
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video) other.pause();
      });
    });
    // A failed source can report its error separately from the player itself.
    function showVideoError() {
      const notice = video.closest("figure")?.querySelector(".video-status");
      if (notice) notice.hidden = false;
    }
    video.addEventListener("error", showVideoError);
    video
      .querySelectorAll("source")
      .forEach((source) => source.addEventListener("error", showVideoError));
  });
  // Closing a story must also stop its hidden recording.
  const cases = [...document.querySelectorAll("details.case")];
  cases.forEach((item) =>
    item.addEventListener("toggle", () => {
      if (!item.open)
        item.querySelectorAll("video").forEach((video) => video.pause());
    }),
  );
  // Pause recordings after scrolling away or switching tabs; never auto-play on return.
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) entry.target.pause();
      });
    });
    videos.forEach((video) => videoObserver.observe(video));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((video) => video.pause());
  });

  // Printed editions include every project without changing the on-screen selection.
  let printState = [];
  window.addEventListener("beforeprint", () => {
    printState = cases.map((item) => item.open);
    cases.forEach((item) => {
      item.open = true;
    });
  });
  window.addEventListener("afterprint", () => {
    cases.forEach((item, index) => {
      item.open = printState[index];
    });
  });
}
