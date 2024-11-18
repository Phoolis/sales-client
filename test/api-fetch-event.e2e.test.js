import { describe, it, expect } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fetchEvents } from "../src/util/api.jsx";

// Mock API server
const server = setupServer(
  rest.get(
    "https://ticketguru.hellmanstudios.fi/api/events",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          { id: 1, name: "Event 1" },
          { id: 2, name: "Event 2" },
        ])
      );
    }
  )
);

describe("E2E Test for Fetching Event Details", () => {
  // Start and stop the server before/after tests
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("fetchEvents should fetch event data from the API", async () => {
    const result = await fetchEvents({
      url: "https://ticketguru.hellmanstudios.fi/api",
      userName: "salesperson@test.com",
      userPass: "salesperson",
    });

    // Check if the response matches the mocked data
    expect(result).toEqual([
      { id: 1, name: "Event 1" },
      { id: 2, name: "Event 2" },
    ]);
  });
});
