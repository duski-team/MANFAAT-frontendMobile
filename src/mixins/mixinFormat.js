import accounting from "accounting-js";
export default {
  methods: {
    formatHarga(a) {
      const penampung = accounting.formatMoney(a, {
        symbol: "Rp",
        precicsion: 2,
        thousand: ".",
        decimal: ",",
        format: { pos: "%s %v", neg: "%s (%v)", zero: "-" },
      });
      return penampung;
    },
  },
};
