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

import createEventMergeId from "../../../../../src/lib/dataElements/eventMergeId/createEventMergeId";

describe("Event Merge ID", () => {
  let turbine;

  beforeEach(() => {
    turbine = {
      logger: jasmine.createSpyObj("logger", ["error"])
    };
  });

  it("returns event merge ID", () => {
    const instanceManager = {
      getAccessor: jasmine.createSpy().and.returnValue({
        createEventMergeId() {
          return "ABC123";
        }
      })
    };
    const dataElement = createEventMergeId({ instanceManager, turbine });

    const value = dataElement({
      instanceName: "myinstance"
    });

    expect(instanceManager.getAccessor).toHaveBeenCalledWith("myinstance");
    expect(value).toBe("ABC123");
  });

  it("logs an error when no matching instance found", () => {
    const instanceManager = {
      getAccessor: () => undefined
    };
    const dataElement = createEventMergeId({ instanceManager, turbine });

    dataElement({
      instanceName: "myinstance"
    });

    expect(turbine.logger.error).toHaveBeenCalledWith(
      'Failed to create event merge ID for instance "myinstance". No matching instance was configured with this name.'
    );
  });
});
