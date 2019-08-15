/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Checkbox from "@react/react-spectrum/Checkbox";

import "./checkboxList.styl";

class CheckboxList extends React.Component {
  onChange = (isChecked, event) => {
    const checkboxValue = event.nativeEvent.target.value;
    const { onChange } = this.props;
    let { value } = this.props;

    if (!value) {
      value = [];
    }

    value = value.slice();

    if (isChecked) {
      value.push(checkboxValue);
    } else {
      const index = value.indexOf(checkboxValue);
      value.splice(index, 1);
    }

    onChange(value);
  };

  render() {
    const { options, value, className } = this.props;
    const listItems = options.map(option => {
      let optionValue;
      let optionLabel;

      if (typeof option === "string") {
        optionValue = option;
        optionLabel = option;
      } else {
        optionValue = option.value;
        optionLabel = option.label;
      }

      return (
        <li key={optionValue}>
          <Checkbox
            value={optionValue}
            checked={value && value.includes(optionValue)}
            onChange={this.onChange}
            label={optionLabel}
          />
        </li>
      );
    });

    return (
      <ul className={classNames("CheckboxList", className)}>{listItems}</ul>
    );
  }
}

CheckboxList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default CheckboxList;
