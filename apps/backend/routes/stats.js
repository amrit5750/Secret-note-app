"use strict";

const Boom = require("@hapi/boom");

module.exports = {
  name: "stats-routes",
  version: "1.0.0",
  register: async function (server, options) {
    const Note = options.NoteModel;

    server.route({
      method: "GET",
      path: "/api/stats",
      options: { tags: ["api"], auth: false },
      handler: async (req, h) => {
        try {
          const now = new Date();

          const [
            totalNotes,
            encryptedNotes,
            viewedNotes,
            activeNotes,
            expiredNotes,
            replies,
          ] = await Promise.all([
            Note.countDocuments({}),
            Note.countDocuments({ encrypted: true }),
            Note.countDocuments({ viewed: true }),
            Note.countDocuments({
              $and: [
                { $or: [{ viewed: { $exists: false } }, { viewed: false }] },
                {
                  $or: [
                    { expiresAt: { $gt: now } },
                    { expiresAt: { $exists: false } },
                  ],
                },
              ],
            }),
            Note.countDocuments({ expiresAt: { $lte: now } }),
            Note.countDocuments({ replyTo: { $ne: null } }),
          ]);

          const storageAgg = await Note.aggregate([
            {
              $project: {
                len: { $strLenBytes: { $ifNull: ["$content", ""] } },
              },
            },
            { $group: { _id: null, totalBytes: { $sum: "$len" } } },
          ]);
          const storageUsedBytes = storageAgg?.[0]?.totalBytes || 0;

          const start = new Date();
          start.setDate(start.getDate() - 6);
          start.setHours(0, 0, 0, 0);

          const created7d = await Note.aggregate([
            { $match: { createdAt: { $gte: start } } },
            {
              $group: {
                _id: {
                  y: { $year: "$createdAt" },
                  m: { $month: "$createdAt" },
                  d: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
          ]);

          const seriesCreated = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const match = created7d.find(
              (x) =>
                x._id.y === d.getUTCFullYear() &&
                x._id.m === d.getUTCMonth() + 1 &&
                x._id.d === d.getUTCDate()
            );
            seriesCreated.push({
              date: d.toISOString(),
              count: match ? match.count : 0,
            });
          }

          const destroyed = viewedNotes + expiredNotes;
          const encryptedPct = totalNotes
            ? Math.round((encryptedNotes / totalNotes) * 100)
            : 0;

          return h.response({
            totals: {
              totalNotes,
              activeNotes,
              destroyed, // total destroyed = viewed + expired
              viewed: viewedNotes,
              expired: expiredNotes,
              replies,
            },
            storage: { usedBytes: storageUsedBytes },
            series: { last7dCreated: seriesCreated },
            generatedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error(err);
          throw Boom.internal("Failed to compute stats");
        }
      },
    });
  },
};
