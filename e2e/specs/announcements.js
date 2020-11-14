import { addAnnouncement, getAnnouncementKey, setAnnouncementKey } from '../pageObjects/announcements'
import { load, sleep, getInfoMessageText } from "../pageObjects";


const infoMessage = 'This is a test announcement';


describe("test announcement", () => {
  beforeEach(async () => {
    await load();
    await addAnnouncement();
    await sleep(4);
  });

  it("should show announcement", async () => {
        expect(await getInfoMessageText()).toEqual([infoMessage]);
        expect(await getAnnouncementKey()).toBe("this-is-a-test-announcement");
  });
});


describe("test announcement already shown", () => {
  beforeEach(async () => {
    await load();
    await setAnnouncementKey();
    await addAnnouncement();
    await sleep(4);
  });

  it("should not show announcement", async () => {
        expect(await getInfoMessageText()).toEqual([]);
        expect(await getAnnouncementKey()).toBe("this-is-a-test-announcement");
  });
});

