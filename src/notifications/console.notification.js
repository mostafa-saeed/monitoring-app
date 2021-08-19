export default {
  condition() {
    return true;
  },

  async handler(check, newStatus) {
    console.log(`${check.name} is now ${newStatus}`);
  },
};
