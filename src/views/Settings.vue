<template>
  <div class="settings">
    <pref-node title="Updates">
      <p>
        <a target="_blank" href="https://opensight-cv.github.io/quickstart/upgrading/">
          Click here
        </a>
        for a tutorial on updating.
      </p>

      <form id="update-form" enctype="multipart/form-data" method="post" name="update-form">
        <input type="file" required />
      </form>
      <p><button id="update-button">Update</button></p>
    </pref-node>

    <pref-node title="Import/Export">
      <p>Import / Export a nodetree.</p>
      <form id="import-form" enctype="multipart/form-data" method="post" name="import-form">
        <input type="file" required />
      </form>
      <p><button id="import-button">Import</button> <button id="export-button">Export</button></p>
    </pref-node>

    <pref-node title="Network Config">
      <p>
        <label for="team-number">Team Number: </label>
        <input id="team-number" type="number" min="1" max="9999" value="1072" required />
      </p>
      <p>
        <label for="ip-assign">IP Assignment Mode:</label>
        <select id="ip-assign">
          <option value="DHCP" selected>DHCP</option>
          <option value="Static">Static</option>
        </select>
      </p>
      <p>
        <label for="nt-enabled">NetworkTables Enabled:</label>
        <input id="nt-enabled" type="checkbox" />
      </p>
      <p>
        <label for="nt-mode">NetworkTables Mode:</label>
        <select id="nt-mode">
          <option value="client" selected>Client</option>
          <option value="server">Server</option>
        </select>
      </p>
    </pref-node>

    <pref-node title="Profiles">
      <p>Current Profile: 420</p>
      <button class="profile-button">0</button>
      <button class="profile-button">1</button>
      <button class="profile-button">2</button>
      <button class="profile-button">3</button>
      <button class="profile-button">4</button>
      <br />
      <button class="profile-button">5</button>
      <button class="profile-button">6</button>
      <button class="profile-button">7</button>
      <button class="profile-button">8</button>
      <button class="profile-button">9</button>
      <br />
      <p><button>Delete Selected Profile</button></p>
    </pref-node>

    <pref-node title="Actions">
      <p><button>Restart OpenSight</button></p>
      <p><button>Restart System</button></p>
      <p><button>Shutdown System</button></p>
    </pref-node>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PrefNode from "@/components/ui/PrefNode.vue";

export default Vue.extend({
  components: { PrefNode },
});
</script>

<style scoped>
.settings {
  background-color: #232323;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  padding: 2% 2%;
  box-sizing: border-box;
}

.settings > div {
  margin-right: 2%;
  margin-bottom: 2%;
}

#team-number,
#ip-assign,
#nt-enabled,
#nt-mode {
  margin-left: 4px;
}

.profile-button {
  margin-right: 2%;
  margin-bottom: 2%;
  width: 18%;
}
</style>
