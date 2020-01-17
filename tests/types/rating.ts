import {compose, Integer, NumberInRange, integer, numberInRange, safeDiv, nonZero} from "../../src";

type Rating = Integer & NumberInRange<1, 5>;
const rating = compose(integer, numberInRange(1,5));

function vote(rating: Rating) {
  safeDiv(rating, nonZero(rating));
}

vote(rating(10));