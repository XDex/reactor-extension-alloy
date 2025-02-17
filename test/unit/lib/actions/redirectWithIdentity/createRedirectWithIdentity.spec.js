/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createRedirectWithIdentity from "../../../../../src/lib/actions/redirectWithIdentity/createRedirectWithIdentity";

describe("createRedirectWithIdentity", () => {
  let instanceManager;
  let instance;
  let document;
  let redirectWithIdentity;
  let event;
  let logger;

  beforeEach(() => {
    instanceManager = jasmine.createSpyObj("instanceManager", ["getInstance"]);
    instance = jasmine.createSpy("instance");
    instanceManager.getInstance.and.returnValue(instance);
    instance.and.returnValue(Promise.resolve({ url: "newurl" }));
    document = { location: "originalLocation" };
    event = {
      nativeEvent: {
        preventDefault: jasmine.createSpy("preventDefault"),
        target: {
          href: "originalHref"
        }
      }
    };
    logger = jasmine.createSpyObj("logger", ["warn"]);
    redirectWithIdentity = createRedirectWithIdentity({
      instanceManager,
      document,
      logger
    });
  });

  it("returns resolved promise when instance isn't found", async () => {
    instanceManager.getInstance.and.returnValue(undefined);
    await expectAsync(
      redirectWithIdentity({ instanceName: "myinstance" }, event)
    ).toBeResolvedTo(undefined);
    expect(instanceManager.getInstance).toHaveBeenCalledOnceWith("myinstance");
    expect(document.location).toEqual("originalLocation");
    expect(event.nativeEvent.preventDefault).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });

  it("doesn't redirect when there is no nativeEvent", async () => {
    await expectAsync(redirectWithIdentity({ instanceName: "myinstance" }, {}));
    expect(document.location).toEqual("originalLocation");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("doesn't redirect when there is no target on the nativeEvent", async () => {
    await expectAsync(
      redirectWithIdentity(
        { instanceName: "myinstance" },
        {
          nativeEvent: {
            preventDefault: event.nativeEvent.preventDefault
          }
        }
      )
    ).toBeResolvedTo(undefined);
    expect(document.location).toEqual("originalLocation");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("doesn't call preventDefault when it isn't defined", async () => {
    await expectAsync(
      redirectWithIdentity(
        { instanceName: "myinstance" },
        {
          nativeEvent: {
            target: {
              href: "originalHref"
            }
          }
        }
      )
    );
    expect(document.location).toEqual("newurl");
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("redirects", async () => {
    await expectAsync(
      redirectWithIdentity({ instanceName: "myinstance" }, event)
    );
    expect(event.nativeEvent.preventDefault).toHaveBeenCalledOnceWith();
    expect(instance).toHaveBeenCalledOnceWith("appendIdentityToUrl", {
      url: "originalHref"
    });
    expect(document.location).toEqual("newurl");
  });
});
