/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/workspace.json`.
 */
export type Workspace = {
  "address": "9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm",
  "metadata": {
    "name": "workspace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkIn",
      "discriminator": [
        209,
        253,
        4,
        217,
        250,
        241,
        207,
        50
      ],
      "accounts": [
        {
          "name": "eventConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "attendance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "string"
        }
      ]
    },
    {
      "name": "createEvent",
      "discriminator": [
        49,
        219,
        29,
        203,
        22,
        98,
        100,
        87
      ],
      "accounts": [
        {
          "name": "eventConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "maxAttendees",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "interestsHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "submitReview",
      "discriminator": [
        106,
        30,
        50,
        83,
        89,
        46,
        213,
        239
      ],
      "accounts": [
        {
          "name": "review",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  105,
                  101,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "reviewer"
              },
              {
                "kind": "account",
                "path": "reviewedUser"
              }
            ]
          }
        },
        {
          "name": "reviewerAttendance",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "reviewer"
              }
            ]
          }
        },
        {
          "name": "reviewedAttendance",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              },
              {
                "kind": "account",
                "path": "reviewedUser"
              }
            ]
          }
        },
        {
          "name": "reviewerProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "reviewer"
              }
            ]
          }
        },
        {
          "name": "reviewedProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "reviewedUser"
              }
            ]
          }
        },
        {
          "name": "reviewer",
          "writable": true,
          "signer": true
        },
        {
          "name": "reviewedUser"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        },
        {
          "name": "commentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "updateReputation",
      "discriminator": [
        194,
        220,
        43,
        201,
        54,
        209,
        49,
        178
      ],
      "accounts": [
        {
          "name": "eventConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "eventId"
              }
            ]
          }
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "eventId",
          "type": "string"
        },
        {
          "name": "newScore",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "attendance",
      "discriminator": [
        86,
        179,
        13,
        208,
        153,
        204,
        118,
        63
      ]
    },
    {
      "name": "eventConfig",
      "discriminator": [
        85,
        63,
        74,
        243,
        198,
        192,
        138,
        0
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    },
    {
      "name": "userReview",
      "discriminator": [
        4,
        79,
        234,
        154,
        205,
        89,
        4,
        35
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "eventNotActive",
      "msg": "Event is not active"
    },
    {
      "code": 6001,
      "name": "eventFull",
      "msg": "Event is full"
    },
    {
      "code": 6002,
      "name": "invalidRating",
      "msg": "Invalid rating, must be 1-5"
    },
    {
      "code": 6003,
      "name": "reputationOverflow",
      "msg": "Reputation score overflow"
    },
    {
      "code": 6004,
      "name": "notCheckedIn",
      "msg": "User is not checked in"
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6006,
      "name": "invalidReputationScore",
      "msg": "Invalid reputation score, must be 0-100"
    },
    {
      "code": 6007,
      "name": "invalidParameter",
      "msg": "Invalid parameter"
    },
    {
      "code": 6008,
      "name": "mathOverflow",
      "msg": "Math overflow occurred"
    }
  ],
  "types": [
    {
      "name": "attendance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "eventId",
            "type": "string"
          },
          {
            "name": "checkedIn",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "eventConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "eventId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "maxAttendees",
            "type": "u32"
          },
          {
            "name": "currentAttendees",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "reputationScore",
            "type": "u16"
          },
          {
            "name": "badgesCount",
            "type": "u16"
          },
          {
            "name": "totalCheckIns",
            "type": "u32"
          },
          {
            "name": "totalMatches",
            "type": "u32"
          },
          {
            "name": "totalReviewsGiven",
            "type": "u32"
          },
          {
            "name": "totalReviewsReceived",
            "type": "u32"
          },
          {
            "name": "interestsHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userReview",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reviewer",
            "type": "pubkey"
          },
          {
            "name": "reviewedUser",
            "type": "pubkey"
          },
          {
            "name": "eventId",
            "type": "string"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "commentHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};