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

module.exports = ({
  turbine,
  window,
  createInstance,
  createEventMergeId,
  orgId,
  wrapOnBeforeEventSend
}) => {
  const { instances: instancesSettings } = turbine.getExtensionSettings();
  const instanceByName = {};

  instancesSettings.forEach(
    ({
      name,
      edgeConfigId,
      stagingEdgeConfigId,
      developmentEdgeConfigId,
      onBeforeEventSend,
      ...options
    }) => {
      const instance = createInstance({ name });
      window[name] = instance;
      instanceByName[name] = instance;

      const computedEdgeConfigId =
        (turbine.environment.stage === "development" &&
          developmentEdgeConfigId) ||
        (turbine.environment.stage === "staging" && stagingEdgeConfigId) ||
        edgeConfigId;

      instance("configure", {
        ...options,
        edgeConfigId: computedEdgeConfigId,
        debugEnabled: turbine.debugEnabled,
        orgId: options.orgId || orgId,
        onBeforeEventSend: wrapOnBeforeEventSend(onBeforeEventSend)
      });
      turbine.onDebugChanged(enabled => {
        instance("setDebug", { enabled });
      });
    }
  );

  return {
    /**
     * Returns an instance by name.
     * @param name
     * @returns {Function}
     */
    getInstance(name) {
      return instanceByName[name];
    },
    /**
     * Synchronously creates an event merge ID.
     * @returns {string}
     */
    createEventMergeId() {
      return createEventMergeId();
    }
  };
};
