import React from "react";
import Spinner from "./Spinner"
import { shallow } from "enzyme"
import toJson from "enzyme-to-json"

describe(`BackDrop component`, () => {
    it(`renders the BackDrop feature`, () => {
        const wrapper = shallow(<Spinner />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});