import {
  validate21Num,
  validate6Num,
  validatePositiveInt,
  validateLetterOrNum
} from '@/utils/validate'
import { isNull } from '@/utils/index.js'

export default {
  // 接口API运行环境
  interfaceApiRulesMap: {
    CASH: {
      'CASH-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-RULES_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-CP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    CMDS: {
      'CMDS-API_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CMDS-IMIX_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CMDS-IMIXR_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CMDS-GUIDE_V': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    RMBRDI: {
      'RMBRDI-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBRDI-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBRDI-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    BOND: {
      'CASH-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CASH-RULES_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    CMDP: {
      'CMDP-API_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CMDP-IMIX_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    CSTP: {
      'CSTP-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CSTP-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CSTP-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CSTP-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    CSWAP: {
      'CSWAP-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CSWAP-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'CSWAP-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    DERIVATIVES: {
      'DERIVATIVES-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-RULES_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-CP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    INFOCMDS: {
      'INFOCMDS-API_IP': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'INFOCMDS-API_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'INFOCMDS-IMIX_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'INFOCMDS-IMIXR_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'INFOCMDS-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    LCAPI: {
      'LCAPI-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'LCPAI-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'LCPAI-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'LCAPI-ORDERTYPE_PQ': [
        { required: false, message: '不能为空', trigger: 'blur' }
      ],
      'LCAPI-ORDERTYPE_LIMIT': [
        { required: false, message: '不能为空', trigger: 'blur' }
      ],
      'LCAPI-ORDERTYPE_BOTH': [
        { required: false, message: '不能为空', trigger: 'blur' }
      ]
    },
    LPAPI: {
      'LPAPI-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'LPAPI-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'LPAPI-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    MAKER: {
      'MAKER-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'MAKER-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'MAKER-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    PAYNOTICE: {
      'PAYNOTICE-IMIXA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PAYNOTICE-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PAYNOTICE-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PAYNOTICE-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PAYNOTICE-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    PLEDGE: {
      'PLEDGE-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PLEDGE-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PLEDGE-IMIXP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PLEDGE-RULES_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PLEDGE-CP_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    PTD: {
      'PTD-GUIDE_V': [{ required: true, message: '不能为空', trigger: 'blur' }],
      'PTD-IMIXA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PTD-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PTD-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'PTD-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    RDI: {
      'RDI-GUIDE_V': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    RECORD: {
      'RECORD-IMIXA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RECORD-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RECORD-IMIXP_A_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RECORD-IMIXP_C_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RECORD-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    RMBCMDS: {
      'RMBCMDS-API_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCMDS-IMIX_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCMDS-IMIXR_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCMDS-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    RMBCSTP: {
      'RMBCSTP-IMIXA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCSTP-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCSTP-IMIXPA_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCSTP-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBCSTP-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    TRD: {
      'TRD-IMIXC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'TRD-IMIXPC_JAR_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'TRD-GUIDE_V': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    // 本币信息产品
    RMBINFOPRO: {
      'RMBINFOCMDS-CMDS_API_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBINFOCMDS-IMIXPRO_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBINFOCMDS-IMIXREL_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'RMBINFOCMDS-DEVGUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    }
  },
  // 自查清单
  checkSelfListRulesMap: {
    CMDS: {
      'CMDS-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    CMDP: {
      'CMDP-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    CSWAP: {
      'CSWAP-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    INFOCMDS: {
      'INFOCMDS-REMARK': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    LCAPI: {
      'LCAPI-WTSBSOO-R': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validatePositiveInt(value)) {
                return callback(new Error('数量支持正整数输入!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'LCAPI-RFQ_SSBIR-R': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validatePositiveInt(value)) {
                callback(new Error('数量支持正整数输入!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ]
    },
    LDR: {
      'LDR-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    MAKER: {
      'MAKER-R': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    PAYNOTICE: {
      'PAYNOTICE-REMARK': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    PTD: {
      'PTD-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    RDI: {
      'RDI-PNOAB-R': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    RECORD: {
      'RECORD-PNOAB-R': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    RMBCSTP: {
      'RMBCSTP-REMARK': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    RMBRDI: {
      'RMBRDI-REMARK': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    TRD: {
      'TRD-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    LPAPI: {},
    CSTP: {
      'CSTP-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    BOND: {
      'BOND-VNBDG': [{ required: true, message: '不能为空', trigger: 'blur' }],
      'BOND-IAB-R': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    RMBCMDS: {
      'RMBCMDS-REMARK': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    CASH: {
      'CASH-PRTETID': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              // callback(new Error('不能为空!'))
              callback()
            } else {
              if (!validateLetterOrNum(value)) {
                callback(new Error('仅可输入字母和数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'CASH-PRTEM21CODE': [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback(new Error('不能为空!'))
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'CASH-HTACVFIT': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ]
    },
    iDeal: {
      'iDeal-GUIDE_V': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'iDeal-REMARK': [{ required: true, message: '不能为空', trigger: 'blur' }]
    },
    DERIVATIVES: {
      'DERIVATIVES-IMSFC-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-IMSFC-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-SRI30T40-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-SRI30T40-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-ISARMM-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-ISARMM-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-RESET-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-CVRESTONLOGON-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-PWD-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-ISCP-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-MARKET-YS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-IHSNDMTH-NS': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      'DERIVATIVES-ISARMM-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              // callback(new Error('不能为空!'))
              callback()
            } else {
              if (!validateLetterOrNum(value)) {
                callback(new Error('仅可输入字母和数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-IMSFC-Y': [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback(new Error('不能为空!'))
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-SRI30T40-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-CVRESTONLOGON-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate6Num(value)) {
                callback(new Error('仅可输入6位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-ISCP-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate6Num(value)) {
                callback(new Error('仅可输入6位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-IHSNDMTH-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate6Num(value)) {
                callback(new Error('仅可输入6位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-ITT-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate6Num(value)) {
                callback(new Error('仅可输入6位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'DERIVATIVES-STBMSI-Y': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate6Num(value)) {
                callback(new Error('仅可输入6位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ]
    },
    PLEDGE: {
      'PLEDGE-PRTETID': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              // callback(new Error('不能为空!'))
              callback()
            } else {
              if (!validateLetterOrNum(value)) {
                callback(new Error('仅可输入字母和数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'PLEDGE-PRTEM21CODE': [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback(new Error('不能为空!'))
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      'PLEDGE-ASIM21CODE': [
        {
          validator: (rule, value, callback) => {
            if (isNull(value)) {
              callback()
            } else {
              if (!validate21Num(value)) {
                callback(new Error('仅可输入21位数字!'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ]
    },
    // 本币信息产品
    RMBINFOPRO: {
      'RMBINFOCMDS-PNOAB-R': [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    }
  },
  // 特殊校验 + 关联勾选
  specialRulesMap: {
    // 新平台本币交易接口衍生品市场验收测试申请单
    // key: array - key: 当前勾选 array 需要关联的数组
    // RMBINFOPRO-本币信息产品
    'RMBINFOCMDS-FILTMARKETMOVE-Y': [
      { value: 'RMBINFOCMDS-FILTMARKETMOVE-R', status: true }
    ],
    'RMBINFOCMDS-FILTMARKETMOVE-N': [
      { value: 'RMBINFOCMDS-FILTMARKETMOVE-R', status: false }
    ],
    // INFOCMDS
    'INFOCMDS-FM-Y': [{ value: 'INFOCMDS-FM-R', status: true }],
    'INFOCMDS-FM-N': [{ value: 'INFOCMDS-FM-R', status: false }],
    // MAKER
    'MAKER-UOC_Y': [{ value: 'MAKER-UOC_R', status: true }],
    'MAKER-UOC_N': [{ value: 'MAKER-UOC_R', status: false }],
    // CSWAP
    'CSWAP-UF_Y': [{ value: 'CSWAP-UF_REMARK', status: true }],
    'CSWAP-UF_N': [{ value: 'CSWAP-UF_REMARK', status: false }],
    // CMDP
    'CMDP-FM_Y': [{ value: 'CMDP-FM_R', status: true }],
    'CMDP-FM_N': [{ value: 'CMDP-FM_R', status: false }],
    // PAYNOTICE
    'PAYNOTICE-QLC_Y': [{ value: 'PAYNOTICE-QLC_REMARK', status: true }],
    'PAYNOTICE-QLC_N': [{ value: 'PAYNOTICE-QLC_REMARK', status: false }],
    // PTD
    'PTD-TLAO_Y': [{ value: 'PTD-TLAO_REMARK', status: true }],
    'PTD-TLAO_N': [{ value: 'PTD-TLAO_REMARK', status: false }],
    'PTD-RTR_Y': [{ value: 'PTD-RTR_REMARK', status: true }],
    'PTD-RTR_N': [{ value: 'PTD-RTR_REMARK', status: false }],
    'PTD-RI_Y': [{ value: 'PTD-RI_REMARK', status: true }],
    'PTD-RI_N': [{ value: 'PTD-RI_REMARK', status: false }],
    'PTD-BS_Y': [{ value: 'PTD-BS_REMARK', status: true }],
    'PTD-BS_N': [{ value: 'PTD-BS_REMARK', status: false }],
    // DERIVATIVES
    'DERIVATIVES-IMSFC-YS': [{ value: 'DERIVATIVES-IMSFC-RS', status: true }],
    'DERIVATIVES-IMSFC-NS': [{ value: 'DERIVATIVES-IMSFC-RS', status: false }],
    'DERIVATIVES-SRI30T40-YS': [
      { value: 'DERIVATIVES-SRI30T40-RS', status: true }
    ],
    'DERIVATIVES-SRI30T40-NS': [
      { value: 'DERIVATIVES-SRI30T40-RS', status: false }
    ],
    // 'DERIVATIVES-DO_M': ['DERIVATIVES-DQTC_M'],
    // 'DERIVATIVES-DO_S': ['DERIVATIVES-DQTC_S'],
    // 'DERIVATIVES-XSWAPC_IRSNRTUSO': ['DERIVATIVES-XSWAPC_SIRSSO'],
    // 'DERIVATIVES-XSWAPC_IRSNRTUA': ['DERIVATIVES-XSWAPC_SIRSA'],
    // 'DERIVATIVES-XSWAPC_IRSNRTUAM': ['DERIVATIVES-XSWAPC_SIRSAM'],
    // 'DERIVATIVES-XSWAPC_SIRSSO': ['DERIVATIVES-XSWAPC_IRSNRTUSO'],
    // 'DERIVATIVES-XSWAPC_SIRSA': ['DERIVATIVES-XSWAPC_IRSNRTUA'],
    // 'DERIVATIVES-XSWAPC_SIRSAM': ['DERIVATIVES-XSWAPC_IRSNRTUAM'],
    'DERIVATIVES-IMSFC-Y': [{ value: 'DERIVATIVES-IMSFC-R', status: true }],
    'DERIVATIVES-IMSFC-N': [{ value: 'DERIVATIVES-IMSFC-R', status: false }],
    'DERIVATIVES-SRI30T40-Y': [
      { value: 'DERIVATIVES-SRI30T40-R', status: true }
    ],
    'DERIVATIVES-SRI30T40-N': [
      { value: 'DERIVATIVES-SRI30T40-R', status: false }
    ],
    // RDI
    'RDI-WTUFTPTMDBD-Y': [{ value: 'RDI-WTUFTPTMDBD-R', status: true }],
    'RDI-WTUFTPTMDBD-N': [{ value: 'RDI-WTUFTPTMDBD-R', status: false }],
    'RDI-WTADTBDAAFPTTP-Y': [{ value: 'RDI-WTADTBDAAFPTTP-R', status: true }],
    'RDI-WTADTBDAAFPTTP-N': [{ value: 'RDI-WTADTBDAAFPTTP-R', status: false }],
    'RDI-DTOADFTPC-Y': [{ value: 'RDI-DTOADFTPC-R', status: true }],
    'RDI-DTOADFTPC-N': [{ value: 'RDI-DTOADFTPC-R', status: false }],
    'RDI-HFEPBDFBSBR-Y': [{ value: 'RDI-HFEPBDFBSBR-R', status: true }],
    'RDI-HFEPBDFBSBR-N': [{ value: 'RDI-HFEPBDFBSBR-R', status: false }],
    // LDR
    'LDR-FTPUD_Y': [{ value: 'LDR-UD_REMARK', status: true }],
    'LDR-FTPUD_N': [{ value: 'LDR-UD_REMARK', status: false }],
    'LDR-AUD_Y': [{ value: 'LDR-AUD_REMARK', status: true }],
    'LDR-AUD_N': [{ value: 'LDR-AUD_REMARK', status: false }],
    // TRD
    'TRD-TI_Y': [{ value: 'TRD-TI_REMARK', status: true }],
    'TRD-TI_N': [{ value: 'TRD-TI_REMARK', status: false }],
    'TRD-LOR_Y': [{ value: 'TRD-LOR_REMARK', status: true }],
    'TRD-LOR_N': [{ value: 'TRD-LOR_REMARK', status: false }],
    'TRD-RI_Y': [{ value: 'TRD-RI_REMARK', status: true }],
    'TRD-RI_N': [{ value: 'TRD-RI_REMARK', status: false }],
    'TRD-FC_Y': [{ value: 'TRD-FC_REMARK', status: true }],
    'TRD-FC_N': [{ value: 'TRD-FC_REMARK', status: false }],
    'TRD-BO_Y': [{ value: 'TRD-BO_REMARK', status: true }],
    'TRD-BO_N': [{ value: 'TRD-BO_REMARK', status: false }],
    'TRD-SSB_Y': [{ value: 'TRD-SSB_REMARK', status: true }],
    'TRD-SSB_N': [{ value: 'TRD-SSB_REMARK', status: false }],
    'TRD-EMI_Y': [{ value: 'TRD-EMI_REMARK', status: true }],
    'TRD-EMI_N': [{ value: 'TRD-EMI_REMARK', status: false }],
    // LCAPI
    'LCAPI-WTSBSOO-Y': [{ value: 'LCAPI-WTSBSOO-R', status: true }],
    'LCAPI-WTSBSOO-N': [{ value: 'LCAPI-WTSBSOO-R', status: false }],
    'LCAPI-RFQ_SSBIR-Y': [{ value: 'LCAPI-RFQ_SSBIR-R', status: true }],
    'LCAPI-RFQ_SSBIR-N': [{ value: 'LCAPI-RFQ_SSBIR-R', status: false }],
    'LCAPI-FXESPQF-Y': [{ value: 'LCAPI-FXESPQF-R', status: true }],
    'LCAPI-FXESPQF-N': [{ value: 'LCAPI-FXESPQF-R', status: false }],
    // RMBCMDS
    'RMBCMDS-FM_Y': [{ value: 'RMBCMDS-FM_R', status: true }],
    'RMBCMDS-FM_N': [{ value: 'RMBCMDS-FM_R', status: false }],
    // RMBRDI
    // 'RMBRDI-BCM_Y': [{ value: 'RMBRDI-BCM_REMARK', status: true }],
    // 'RMBRDI-BCM_N': [{ value: 'RMBRDI-BCM_REMARK', status: false }],
    'RMBRDI-FTPD_Y': [{ value: 'RMBRDI-FTPD_REMARK', status: true }],
    'RMBRDI-FTPD_N': [{ value: 'RMBRDI-FTPD_REMARK', status: false }],
    'RMBRDI-AD_Y': [{ value: 'RMBRDI-AD_REMARK', status: true }],
    'RMBRDI-AD_N': [{ value: 'RMBRDI-AD_REMARK', status: false }],
    'RMBRDI-FTPDIS_Y': [{ value: 'RMBRDI-FTPDIS_REMARK', status: true }],
    'RMBRDI-FTPDIS_N': [{ value: 'RMBRDI-FTPDIS_REMARK', status: false }],
    'RMBRDI-ABD_Y': [{ value: 'RMBRDI-ABD_REMARK', status: true }],
    'RMBRDI-ABD_N': [{ value: 'RMBRDI-ABD_REMARK', status: false }],
    'RMBRDI-APISAI_Y': [{ value: 'RMBRDI-APISAI_REMARK', status: true }],
    'RMBRDI-APISAI_N': [{ value: 'RMBRDI-APISAI_REMARK', status: false }],
    'RMBRDI-APIRT_Y': [{ value: 'RMBRDI-APIRT_REMARK', status: true }],
    'RMBRDI-APIRT_N': [{ value: 'RMBRDI-APIRT_REMARK', status: false }],
    'RMBRDI-APIRI_Y': [{ value: 'RMBRDI-APIRI_REMARK', status: true }],
    'RMBRDI-APIRI_N': [{ value: 'RMBRDI-APIRI_REMARK', status: false }],

    // iDeal
    'iDeal-CR_Y': [{ value: 'iDeal-CR_REMARK', status: true }],
    'iDeal-CR_N': [{ value: 'iDeal-CR_REMARK', status: false }],
    'iDeal-TACK_Y': [{ value: 'iDeal-TACK_REMARK', status: true }],
    'iDeal-TACK_N': [{ value: 'iDeal-TACK_REMARK', status: false }],
    'iDeal-RALIVE_Y': [{ value: 'iDeal-RALIVE_REMARK', status: true }],
    'iDeal-RALIVE_N': [{ value: 'iDeal-RALIVE_REMARK', status: false }],
    'iDeal-GIU_Y': [{ value: 'iDeal-GIU_REMARK', status: true }],
    'iDeal-GIU_N': [{ value: 'iDeal-GIU_REMARK', status: false }],
    'iDeal-GPCH_Y': [{ value: 'iDeal-GPCH_REMARK', status: true }],
    'iDeal-GPCH_N': [{ value: 'iDeal-GPCH_REMARK', status: false }],
    'iDeal-GL_Y': [{ value: 'iDeal-GL_REMARK', status: true }],
    'iDeal-GL_N': [{ value: 'iDeal-GL_REMARK', status: false }],
    'iDeal-HC_Y': [{ value: 'iDeal-HC_REMARK', status: true }],
    'iDeal-HC_N': [{ value: 'iDeal-HC_REMARK', status: false }],
    'iDeal-ATID_Y': [{ value: 'iDeal-ATID_REMARK', status: true }],
    'iDeal-ATID_N': [{ value: 'iDeal-ATID_REMARK', status: false }],
    'iDeal-STID_Y': [{ value: 'iDeal-STID_REMARK', status: true }],
    'iDeal-STID_N': [{ value: 'iDeal-STID_REMARK', status: false }],
    'iDeal-AAD_Y': [{ value: 'iDeal-AAD_REMARK', status: true }],
    'iDeal-AAD_N': [{ value: 'iDeal-AAD_REMARK', status: false }],
    'iDeal-MI_Y': [{ value: 'iDeal-MI_REMARK', status: true }],
    'iDeal-MI_N': [{ value: 'iDeal-MI_REMARK', status: false }],
    'iDeal-SLM_Y': [{ value: 'iDeal-SLM_REMARK', status: true }],
    'iDeal-SLM_N': [{ value: 'iDeal-SLM_REMARK', status: false }],
    'iDeal-QFS_Y': [{ value: 'iDeal-QFS_REMARK', status: true }],
    'iDeal-QFS_N': [{ value: 'iDeal-QFS_REMARK', status: false }],
    'iDeal-QSS_Y': [{ value: 'iDeal-QSS_REMARK', status: true }],
    'iDeal-QSS_N': [{ value: 'iDeal-QSS_REMARK', status: false }],
    'iDeal-QOS_Y': [{ value: 'iDeal-QOS_REMARK', status: true }],
    'iDeal-QOS_N': [{ value: 'iDeal-QOS_REMARK', status: false }],
    'iDeal-NWB_Y': [{ value: 'iDeal-NWB_REMARK', status: true }],
    'iDeal-NWB_N': [{ value: 'iDeal-NWB_REMARK', status: false }],
    'iDeal-UDABC_Y': [{ value: 'iDeal-UDABC_REMARK', status: true }],
    'iDeal-UDABC_N': [{ value: 'iDeal-UDABC_REMARK', status: false }],
    // CASH
    'CASH-SSFC-Y': [{ value: 'CASH-SSFC-R', status: true }],
    'CASH-SSFC-N': [{ value: 'CASH-SSFC-R', status: false }],
    'CASH-WTSR30I40-Y': [{ value: 'CASH-WTSR30I40-R', status: true }],
    'CASH-WTSR30I40-N': [{ value: 'CASH-WTSR30I40-R', status: false }],
    // PLEDGE
    'PLEDGE-SSFC-Y': [{ value: 'PLEDGE-SSFC-R', status: true }],
    'PLEDGE-SSFC-N': [{ value: 'PLEDGE-SSFC-R', status: false }],
    'PLEDGE-WTSR30I40-Y': [{ value: 'PLEDGE-WTSR30I40-R', status: true }],
    'PLEDGE-WTSR30I40-N': [{ value: 'PLEDGE-WTSR30I40-R', status: false }],
    'PLEDGE-SMPB-Y': [{ value: 'PLEDGE-SMPB-R', status: true }],
    'PLEDGE-SMPB-N': [{ value: 'PLEDGE-SMPB-R', status: false }],
    // Bond
    'BOND-WUFTPTMDUD-Y': [{ value: 'BOND-WUFTPTMDUD-R', status: true }],
    'BOND-WUFTPTMDUD-N': [{ value: 'BOND-WUFTPTMDUD-R', status: false }],
    'BOND-WTRFPADUDTP-Y': [{ value: 'BOND-WTRFPADUDTP-R', status: true }],
    'BOND-WTRFPADUDTP-N': [{ value: 'BOND-WTRFPADUDTP-R', status: false }],
    // LP API
    'LPAPI-ESP1PEQV-1': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-2': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-3': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-4': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-5': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-6': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-7': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-8': [{ value: 'LPAPI-ESP1PEQV-R', status: false }],
    'LPAPI-ESP1PEQV-9': [{ value: 'LPAPI-ESP1PEQV-R', status: true }],
    'LPAPI-ESP2PEQV-1': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-2': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-3': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-4': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-5': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-6': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-7': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-8': [{ value: 'LPAPI-ESP2PEQV-R', status: false }],
    'LPAPI-ESP2PEQV-9': [{ value: 'LPAPI-ESP2PEQV-R', status: true }],
    'LPAPI-ESP3PEQV-1': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-2': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-3': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-4': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-5': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-6': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-7': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-8': [{ value: 'LPAPI-ESP3PEQV-R', status: false }],
    'LPAPI-ESP3PEQV-9': [{ value: 'LPAPI-ESP3PEQV-R', status: true }],
    'LPAPI-CCPESP_PEQV-1': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-2': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-3': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-4': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-5': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-6': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-7': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-8': [{ value: 'LPAPI-CCPESP_PEQV-R', status: false }],
    'LPAPI-CCPESP_PEQV-9': [{ value: 'LPAPI-CCPESP_PEQV-R', status: true }],
    'LPAPI-FX_BIL_ESP_FLOOR-1': [
      { value: 'LPAPI-ESP1_FQUM-1', status: true },
      { value: 'LPAPI-ESP1_FQUM-2', status: true },
      { value: 'LPAPI-ORDERTYPE_1', status: true },
      { value: 'LPAPI-ORDERTYPE_2', status: true },
      { value: 'LPAPI-ESP1QM-1', status: true },
      { value: 'LPAPI-ESP1QM-2', status: true },
      { value: 'LPAPI-ESP1QM-3', status: true },
      { value: 'LPAPI-ESP1STMQD-1', status: true },
      { value: 'LPAPI-ESP1STMQD-2', status: true },
      { value: 'LPAPI-ESP1STMQD-3', status: true },
      { value: 'LPAPI-ESP1STMQD-4', status: true },
      { value: 'LPAPI-ESP1STMQD-5', status: true },
      { value: 'LPAPI-ESP1PEQV-1', status: true },
      { value: 'LPAPI-ESP1PEQV-2', status: true },
      { value: 'LPAPI-ESP1PEQV-3', status: true },
      { value: 'LPAPI-ESP1PEQV-4', status: true },
      { value: 'LPAPI-ESP1PEQV-5', status: true },
      { value: 'LPAPI-ESP1PEQV-6', status: true },
      { value: 'LPAPI-ESP1PEQV-7', status: true },
      { value: 'LPAPI-ESP1PEQV-8', status: true },
      { value: 'LPAPI-ESP1PEQV-9', status: true },
      { value: 'LPAPI-ESP1PEQV-R', status: true }
    ],
    'LPAPI-FX_BIL_ESP_FLOOR-2': [
      { value: 'LPAPI-ESP2QUM-1', status: true },
      { value: 'LPAPI-ESP2QUM-2', status: true },
      { value: 'LPAPI-ESP2QUM-2', status: true },
      { value: 'LPAPI-ESP2_ORDERTYPE-1', status: true },
      { value: 'LPAPI-ESP2_ORDERTYPE-2', status: true },
      { value: 'LPAPI-ESP2_QM-1', status: true },
      { value: 'LPAPI-ESP2_QM-2', status: true },
      { value: 'LPAPI-ESP2_QM-3', status: true },
      { value: 'LPAPI-ESP2STMQD-1', status: true },
      { value: 'LPAPI-ESP2STMQD-2', status: true },
      { value: 'LPAPI-ESP2STMQD-3', status: true },
      { value: 'LPAPI-ESP2STMQD-4', status: true },
      { value: 'LPAPI-ESP2STMQD-5', status: true },
      { value: 'LPAPI-ESP2PEQV-1', status: true },
      { value: 'LPAPI-ESP2PEQV-2', status: true },
      { value: 'LPAPI-ESP2PEQV-3', status: true },
      { value: 'LPAPI-ESP2PEQV-4', status: true },
      { value: 'LPAPI-ESP2PEQV-5', status: true },
      { value: 'LPAPI-ESP2PEQV-6', status: true },
      { value: 'LPAPI-ESP2PEQV-7', status: true },
      { value: 'LPAPI-ESP2PEQV-8', status: true },
      { value: 'LPAPI-ESP2PEQV-9', status: true },
      { value: 'LPAPI-ESP2PEQV-R', status: true }
    ],
    'LPAPI-FX_BIL_ESP_FLOOR-3': [
      { value: 'LPAPI-ESP3QUM-1', status: true },
      { value: 'LPAPI-ESP3QUM-2', status: true },
      { value: 'LPAPI-ESP3_ORDERTYPE-1', status: true },
      { value: 'LPAPI-ESP3_ORDERTYPE-2', status: true },
      { value: 'LPAPI-ESP3_QM-1', status: true },
      { value: 'LPAPI-ESP3_QM-2', status: true },
      { value: 'LPAPI-ESP3_QM-3', status: true },
      { value: 'LPAPI-ESP3_STMQD-1', status: true },
      { value: 'LPAPI-ESP3_STMQD-2', status: true },
      { value: 'LPAPI-ESP3_STMQD-3', status: true },
      { value: 'LPAPI-ESP3_STMQD-4', status: true },
      { value: 'LPAPI-ESP3_STMQD-5', status: true },
      { value: 'LPAPI-ESP3PEQV-1', status: true },
      { value: 'LPAPI-ESP3PEQV-2', status: true },
      { value: 'LPAPI-ESP3PEQV-3', status: true },
      { value: 'LPAPI-ESP3PEQV-4', status: true },
      { value: 'LPAPI-ESP3PEQV-5', status: true },
      { value: 'LPAPI-ESP3PEQV-6', status: true },
      { value: 'LPAPI-ESP3PEQV-7', status: true },
      { value: 'LPAPI-ESP3PEQV-8', status: true },
      { value: 'LPAPI-ESP3PEQV-9', status: true }
    ],

    // 根据第三步使第五步必填
    // 外汇CSTP
    // D27
    'CSTP-FXO': [
      'CSTP-EN_Y',
      'CSTP-EN_N',
      'CSTP-WN_Y',
      'CSTP-WN_N',
      'CSTP-BEN_Y',
      'CSTP-BEN_N',
      'CSTP-BWN_Y',
      'CSTP-BWN_N'
    ],
    // D29
    'CSTP-OR_DELTA': [
      'CSTP-EXOP_Y',
      'CSTP-EXOP_N',
      'CSTP-HT_Y',
      'CSTP-HT_N',
      'CSTP-BHT_Y',
      'CSTP-BHT_N'
    ],
    // D30
    'CSTP-OR_EXOP': [
      'CSTP-EXOP_Y',
      'CSTP-EXOP_N',
      'CSTP-HT_Y',
      'CSTP-HT_N',
      'CSTP-BEXOP_Y',
      'CSTP-BEXOP_N'
    ],
    // 本方成交查询
    'CSTP-FX_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-CCS_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-GOLD_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-FXO_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-OR_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-FXL_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-FXREPO_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-IRS_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    'CSTP-FXLBD_OTQ': ['CSTP-TIME_Y', 'CSTP-TIME_N', 'CSTP-NC_Y', 'CSTP-NC_N'],
    // DERIVATIVES
    // 17~20
    // XSWAP订单（IRS实时承接交易账户）
    'DERIVATIVES-XSWAP_IRSURTTA': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    // XSWAP订单（IRS非实时承接自营）
    'DERIVATIVES-XSWAP_IRSNRTUSO': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    // XSWAP订单（IRS非实时承接代理）
    'DERIVATIVES-XSWAP_IRSNRTUSOS': [
      'DERIVATIVES-OUT-YS',
      'DERIVATIVES-ITT-NS'
    ],
    // XSWAP订单（IRS非实时承接资管）
    'DERIVATIVES-XSWAP_IRSNRTUAM': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    // 21~24
    'DERIVATIVES-DO_M': [
      'DERIVATIVES-OUT-YS',
      'DERIVATIVES-ITT-NS',
      'DERIVATIVES-NDM-YS',
      'DERIVATIVES-STBMSI-NS',
      'DERIVATIVES-SQI-YS',
      'DERIVATIVES-SQI-NS',
      'DERIVATIVES-SROC-YS',
      'DERIVATIVES-SROC-NS'
    ],
    'DERIVATIVES-DO_S': [
      'DERIVATIVES-OUT-YS',
      'DERIVATIVES-ITT-NS',
      'DERIVATIVES-NDM-YS',
      'DERIVATIVES-STBMSI-NS',
      'DERIVATIVES-SQI-YS',
      'DERIVATIVES-SQI-NS',
      'DERIVATIVES-SROC-YS',
      'DERIVATIVES-SROC-NS'
    ],
    'DERIVATIVES-DQTC_M': [
      'DERIVATIVES-OUT-YS',
      'DERIVATIVES-ITT-NS',
      'DERIVATIVES-NDM-YS',
      'DERIVATIVES-STBMSI-NS',
      'DERIVATIVES-SQI-YS',
      'DERIVATIVES-SQI-NS',
      'DERIVATIVES-SROC-YS',
      'DERIVATIVES-SROC-NS'
    ],
    'DERIVATIVES-DQTC_S': [
      'DERIVATIVES-OUT-YS',
      'DERIVATIVES-ITT-NS',
      'DERIVATIVES-NDM-YS',
      'DERIVATIVES-STBMSI-NS',
      'DERIVATIVES-SQI-YS',
      'DERIVATIVES-SQI-NS',
      'DERIVATIVES-SROC-YS',
      'DERIVATIVES-SROC-NS'
    ],
    // 33~35
    'DERIVATIVES-XSWAPO_SIRSSO': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    'DERIVATIVES-XSWAPO_SIRSA': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    'DERIVATIVES-XSWAPO_SIRSAM': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'],
    'DERIVATIVES-XSWAPO_SBF': ['DERIVATIVES-OUT-YS', 'DERIVATIVES-ITT-NS'], // 42
    // 25~28
    // XSWAP行情（IRS实时承接交易账户）
    'DERIVATIVES-XSWAPM_IRSRTUTA': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（IRS非实时承接自营）
    'DERIVATIVES-XSWAPM_IRSNRTUSO': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（IRS非实时承接代理）
    'DERIVATIVES-XSWAPM_IRSNRTUA': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（IRS非实时承接资管）
    'DERIVATIVES-XSWAPM_IRSNRTUAM': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // 36~38
    // XSWAP行情（标准利率互换自营）
    'DERIVATIVES-XSWAPM_SOBSIRS': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（标准利率互换代理）
    'DERIVATIVES-XSWAPM_SIRSA': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（标准利率互换资管）
    'DERIVATIVES-XSWAPM_SIRSAM': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // XSWAP行情（标债远期）
    'DERIVATIVES-XSWAPM_SBF': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    'DERIVATIVES-XSWAPM_IRSRTUTA_X3': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    'DERIVATIVES-XSWAPM_IRSNRTUAM_X3': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    'DERIVATIVES-XSWAPM_TBTM_X3': [
      'DERIVATIVES-PSXSWAPMSAR-YS',
      'DERIVATIVES-PSXSWAPMSAR-NS'
    ],
    // PB交易
    'CSTP-PB': [
      'CSTP-PS_SPOT',
      'CSTP-PS_LT',
      'CSTP-PS_SWAP',
      'CSTP-PS_CSS',
      'CSTP-PS_OP',
      'CSTP-PS_OR'
    ],
    // LC API
    // E18
    'LCAPI-SPOT_BIL_QS': [
      'LCAPI-FXESP_QA-Y',
      'LCAPI-FXESP_QA-N',
      'LCAPI-FXESPQS-TB',
      'LCAPI-FXESPQS-FB',
      'LCAPI-FXESPQS-NB',
      'LCAPI-QS_SMS-Y',
      'LCAPI-QS_SMS-N',
      'LCAPI-FXESPQS-LP',
      'LCAPI-FXESPQS-TLP',
      'LCAPI-FXESPQS-NLP'
    ],
    // E17
    'LCAPI-SPO_CCP_QF': [
      'LCAPI-FXESPQF-Y',
      'LCAPI-FXESPQF-N',
      'LCAPI-FXESPQF-TB',
      'LCAPI-FXESPQF-FB',
      'LCAPI-FXESPQF-NB',
      'LCAPI-FXESPQF-NLP',
      'LCAPI-FXESPQF-LP',
      'LCAPI-FXESPQF-TLP'
    ],
    // E19
    'LCAPI-SPOT_BIL_QF': [
      'LCAPI-FXESPQF-Y',
      'LCAPI-FXESPQF-N',
      'LCAPI-FXESPQF-TB',
      'LCAPI-FXESPQF-FB',
      'LCAPI-FXESPQF-NB',
      'LCAPI-FXESPQF-NLP',
      'LCAPI-FXESPQF-LP',
      'LCAPI-FXESPQF-TLP'
    ],
    // E20~E23
    'LCAPI-SPOT_BIL_QR': [
      'LCAPI-ORDERTYPE_PQ',
      'LCAPI-ORDERTYPE_LIMIT',
      'LCAPI-ORDERTYPE_BOTH'
    ],
    'LCAPI-SPOT_CCP_QR': [
      'LCAPI-ORDERTYPE_PQ',
      'LCAPI-ORDERTYPE_LIMIT',
      'LCAPI-ORDERTYPE_BOTH'
    ],
    'LCAPI-FWD_BIL_QR': [
      'LCAPI-ORDERTYPE_PQ',
      'LCAPI-ORDERTYPE_LIMIT',
      'LCAPI-ORDERTYPE_BOTH'
    ],
    'LCAPI-SWP_BIL_QR': [
      'LCAPI-ORDERTYPE_PQ',
      'LCAPI-ORDERTYPE_LIMIT',
      'LCAPI-ORDERTYPE_BOTH'
    ],
    // E16
    'LCAPI-SPOT_OC': [
      'LCAPI-FXESPOC-TB',
      'LCAPI-FXESPOC-FB',
      'LCAPI-FXESPOC-NB',
      'LCAPI-TYPEODM-CS',
      'LCAPI-TYPEODM-NCS',
      'LCAPI-TYPEODM-S',
      'LCAPI-SOIO-Y',
      'LCAPI-SOIO-N'
    ],
    // LP API
    // E19
    'LPAPI-FCS-ESP': [
      'LPAPI-CCPESPQUM-1',
      'LPAPI-CCPESPQUM-2',
      'LPAPI-CCPESP_ORDERTYPE-1',
      'LPAPI-CCPESP_ORDERTYPE-2',
      'LPAPI-CCPESP_QM-1',
      'LPAPI-CCPESP_QM-2',
      'LPAPI-CCPESP_QM-3',
      'LPAPI-CCPESP_STMQD-1',
      'LPAPI-CCPESP_STMQD-2',
      'LPAPI-CCPESP_STMQD-3',
      'LPAPI-CCPESP_STMQD-4',
      'LPAPI-CCPESP_PEQV-1',
      'LPAPI-CCPESP_PEQV-2',
      'LPAPI-CCPESP_PEQV-3',
      'LPAPI-CCPESP_PEQV-4',
      'LPAPI-CCPESP_PEQV-5',
      'LPAPI-CCPESP_PEQV-6',
      'LPAPI-CCPESP_PEQV-7',
      'LPAPI-CCPESP_PEQV-8',
      'LPAPI-CCPESP_PEQV-9',
      'LPAPI-CCPRFQ-Y',
      'LPAPI-CCPRFQ-N'
    ],
    // E26
    'LPAPI-RMBFES-CCPESP': [
      'LPAPI-CCPESPQUM-1',
      'LPAPI-CCPESPQUM-2',
      'LPAPI-CCPESP_ORDERTYPE-1',
      'LPAPI-CCPESP_ORDERTYPE-2',
      'LPAPI-CCPESP_QM-1',
      'LPAPI-CCPESP_QM-2',
      'LPAPI-CCPESP_QM-3',
      'LPAPI-CCPESP_STMQD-1',
      'LPAPI-CCPESP_STMQD-2',
      'LPAPI-CCPESP_STMQD-3',
      'LPAPI-CCPESP_STMQD-4',
      'LPAPI-CCPESP_PEQV-1',
      'LPAPI-CCPESP_PEQV-2',
      'LPAPI-CCPESP_PEQV-3',
      'LPAPI-CCPESP_PEQV-4',
      'LPAPI-CCPESP_PEQV-5',
      'LPAPI-CCPESP_PEQV-6',
      'LPAPI-CCPESP_PEQV-7',
      'LPAPI-CCPESP_PEQV-8',
      'LPAPI-CCPESP_PEQV-9',
      'LPAPI-CCPRFQ-Y',
      'LPAPI-CCPRFQ-N'
    ]
  },
  // 货币对
  currencyPairList: [
    'AUX/CNY',
    'AUY/CNY',
    'USD/SGD',
    'USD/HKD',
    'USD/CAD',
    'EUR/USD',
    'AUD/USD',
    'USD/JPY',
    'USD/CHF',
    'GBP/USD',
    'EUR/JPY',
    'NZD/USD',
    'EUR/GBP',
    'USD/CNY',
    'NZD/CNY',
    'HKD/CNY',
    'EUR/CNY',
    'CNY/VND',
    'CNY/THB',
    'CNY/SAR',
    'CNY/RUB',
    'CNY/NOK',
    'CNY/MXN',
    'CNY/KRW',
    'CNY/DKK',
    'CHF/CNY',
    'AUD/CNY',
    'SGD/CNY',
    'JPY/CNY',
    'GBP/CNY',
    'CNY/ZAR',
    'CNY/TRY',
    'CNY/SEK',
    'CNY/PLN',
    'CNY/MYR',
    'CNY/KZT',
    'CNY/HUF',
    'CNY/AED',
    'CAD/CNY'
  ],
  // 需要选择货币对修改说明的勾选项
  needSelectedToIntro: {
    'CMDP-FM_Y': 'CMDP-FM_R',
    'CMDS-FM_Y': 'CMDS-FM_R',
    'CMDP-FM_N': 'CMDP-FM_R',
    'CMDS-FM_N': 'CMDS-FM_R'
  },

  needWriteNum: {
    // 当前勾选LPAPI 中的其他 需要弹窗输入具体的量
    'LPAPI-ESP1PEQV-9': 'LPAPI-ESP1PEQV-R',
    'LPAPI-ESP2PEQV-9': 'LPAPI-ESP2PEQV-R',
    'LPAPI-ESP3PEQV-9': 'LPAPI-ESP3PEQV-R',
    'LPAPI-CCPESP_PEQV-9': 'LPAPI-CCPESP_PEQV-R',
    // 当前勾选LCAPI的LCAPI-FXESPQF-Y  需要弹窗输入
    'LCAPI-FXESPQF-Y': 'LCAPI-FXESPQF-R'
  },
  // 验收测试第五步需要根据其他步骤初始化校验的表单英文名
  stepFiveNeedInitValidRuleList: ['CSTP', 'LPAPI', 'LCAPI', 'DERIVATIVES'],
  // 除特殊说明外的所有有单选框的表单加非空校验
  initValidRuleList: [],
  // initValidRuleList: ['BOND', 'CSTP', 'CASH', 'CMDP', 'CMDS', 'CSWAP', 'DERIVATIVES',
  //   'INFOCMDS', 'LCAPI', 'LPAPI', 'LDR', 'MAKER', 'PAYNOTICE', 'PLEDGE', 'PTD', 'RDI', 'RECORD',
  //   'RMBCMDS', 'RMBCSTP', 'RMBRDI', 'TRD', 'iDeal'],
  // 有特殊的单选框不做非空校验的表单
  // specialRadioCanNullFormList: ['LCAPI', 'DERIVATIVES', 'CASH'],
  HasReconnectRemark: {
    LCAPI:
      'RFQ断线重连次数应介于1次-10次之间！The number of RFQ reconnection should be between 1-10 times!\n断线重连间隔应大于1秒!The reconnection should be greater than 1 second！'
  },
  RemarkList: {
    CMDP:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法： \njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    CMDS:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\n1)CMDSAPI.jar查看版本方法：\njava -cp CMDSAPI.jar cmdsimix.client.core.version.Version\n2)IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\n3)iMIXRelated.jar查看版本方法：\njava -cp iMIXRelated.jar version.Version',
    CSWAP:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    PTD:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol1and2.jar查看版本方法：\njava -cp IMIXProtocol1and2.jar imix.protocol.version.Version，IMIXProtocol1and2为所查看jar包的文件名（大小写敏感）。\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    // RMBCMDS:
    //   'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\n1)CMDSAPI.jar查看版本方法：\njava -cp CMDSAPI.jar cmdsimix.client.core.version.Version\n2)IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version \n3)iMIXRelated.jar查看版本方法：\njava -cp iMIXRelated.jar version.Version',
    RMBCSTP:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    RMBRDI:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    TRD:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol1and2.jar查看版本方法：\njava -cp IMIXProtocol1and2.jar imix.protocol.version.Version\nimixClientAPI_FOR_jdk1.7.jar查看版本方法：\njava -cp imixClientAPI_FOR_jdk1.7.jar imix.imixclientapi.version.Version',
    PAYNOTICE:
      '1.jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\n                                           \nHow to obtain the version of API：In command line mode,go to the lib path where the jar files are located, type the following command:\nCheck the version of IMIXProtocol.jar:\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nCheck the version of IMIXClientAPI.jar:\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    CSTP:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    LCAPI:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，\n运行命令IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\n                                                   \nHow to obtain the version of API：In command line mode,go to the lib path where the jar files are located, type the following command:\nCheck the version of IMIXProtocol.jar:\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nCheck the version of IMIXClientAPI.jar:\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    LPAPI:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，\n运行命令IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\n                                                   \nHow to obtain the version of API：In command line mode,go to the lib path where the jar files are located, type the following command:\nCheck the version of IMIXProtocol.jar:\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nCheck the version of IMIXClientAPI.jar:\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    RDI:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    MAKER:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    CASH:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol1and2.jar查看版本方法：\njava -cp IMIXProtocol1and2.jar imix.protocol.version.Version ，IMIXProtocol1and2 为所查看jar包的文件名（大小写敏感）。\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\nrules.jar查看版本方法：\njava -cp rules.jar rdi.monitor.version.Version ，rules.jar 为所查看jar包的文件名（大小写敏感）。',
    DERIVATIVES:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol1and2.jar查看版本方法：\njava -cp IMIXProtocol1and2.jar imix.protocol.version.Version ，IMIXProtocol1and2 为所查看jar包的文件名（大小写敏感）。\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\nrules.jar查看版本方法：\njava -cp rules.jar rdi.monitor.version.Version ，rules.jar 为所查看jar包的文件名（大小写敏感）。',
    PLEDGE:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol1and2.jar查看版本方法：\njava -cp IMIXProtocol1and2.jar imix.protocol.version.Version ，IMIXProtocol1and2 为所查看jar包的文件名（大小写敏感）。\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version\nrules.jar查看版本方法：\njava -cp rules.jar rdi.monitor.version.Version ，rules.jar 为所查看jar包的文件名（大小写敏感）。',
    RECORD:
      'Jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法：\njava -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    INFOCMDS:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\n1)CMDSAPI.jar查看版本方法：\njava -cp CMDSAPI.jar cmdsimix.client.core.version.Version\n2)IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\n3)iMIXRelated.jar查看版本方法： \njava -cp iMIXRelated.jar version.Version',
    BOND:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\nIMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\nIMIXClientAPI.jar查看版本方法： java -cp IMIXClientAPI.jar imix.imixclientapi.version.Version',
    // 本币信息产品
    RMBINFOPRO:
      'jar包版本查看说明：cmd窗口下进入所需查看的jar包所在lib目录，运行命令\n1)CMDSAPI.jar查看版本方法：\njava -cp CMDSAPI.jar cmdsimix.client.core.version.Version\n2)IMIXProtocol.jar查看版本方法：\njava -cp IMIXProtocol.jar imix.protocol.version.Version\n3)iMIXRelated.jar查看版本方法：\njava -cp iMIXRelated.jar version.Version'
  }
}
