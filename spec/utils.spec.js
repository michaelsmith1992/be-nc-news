const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index")
const testData = require("./data/test-data")

describe('formatDates', () => {
  it("should format a date correctly - 1 item array", () => {
    const actual = formatDates([articleData[0]], "created_at")
    const expected = "2018-11-15T12:21:54.171Z"
    expect(actual[0].created_at).to.equal(expected)
    expect(actual).to.not.eql(articleData);
  })
  it("should format a date correctly - multi item array", () => {
    const actual = formatDates(articleData, "created_at")
    const expected1 = '2018-11-15T12:21:54.171Z'
    const expected2 = '2014-11-16T12:21:54.171Z'
    const expected3 = '2010-11-17T12:21:54.171Z'
    expect(actual[0].created_at).to.equal(expected1)
    expect(actual[1].created_at).to.equal(expected2)
    expect(actual[2].created_at).to.equal(expected3)
  })
});

describe('makeRefObj', () => {
  it("should make a reference object", () => {
    const input = articleData
    const actual = makeRefObj(input, "title", "topic")
    const expected = {
      "A": "mitch",
      "Am I a cat?": "mitch",
      "Does Mitch predate civilisation?": "mitch",
      "Eight pug gifs that remind me of mitch": "mitch",
      "Living in the shadow of a great man": "mitch",
      "Moustache": "mitch",
      "Seven inspirational thought leaders from Manchester UK": "mitch",
      "Sony Vaio; or, The Laptop": "mitch",
      "Student SUES Mitch!": "mitch",
      "They're not exactly dogs, are they?": "mitch",
      "UNCOVERED: catspiracy to bring down democracy": "cats",
      "Z": "mitch"
    }
    expect(actual).to.eql(expected);
    expect(input).to.not.eql(actual)
  })
});

describe('formatComments', () => {
  it("should return formatted comments with author and title ", () => {
    const arcRef = makeRefObj(testData, "title", "article_id")
    const actual = formatComments(commentData, arcRef)
    expect(actual[0].author).to.be.a("string")
    expect(actual[0].article_id).to.be.a("number")
    expect(commentData).to.not.eql(actual)
  });
});
