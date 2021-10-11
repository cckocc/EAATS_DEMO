export default {
  // 路由
  route: {
    home: 'Home',
    login: 'Login',
    register: 'Register',
    retrievePassword: 'Forgot password',
    modifyPassword: 'Modify Password',
    link: 'Link',
    success: 'Success',
    privacyPolicy: 'Privacy Policy',
    interfaceService: {
      index: 'API Service',
      serviceOpening: 'API Service Opening',
      acceptanceTest: 'Certification Testing',
      interfaceOnline: 'Interface Go-live',
      interfaceChange: 'Permission Change',
      myService: 'My Service',
      serviceApply: 'Service Application'
    },
    interfaceSupport: {
      index: 'Interface Support',
      businessOverview: 'Business Overview'
    },
    interfaceResource: {
      index: 'Interface Resource',
      protocolStandard: 'Protocol Standard',
      resourceDownload: 'Resource Download',
      developmentGuidance: 'Development Guidance',
      guidanceDownload: 'Guidance Download'
    },
    notice: {
      index: 'Notice',
      articleList: 'Article List'
    }
  },
  // 公共
  common: {
    username: 'Username',
    password: 'Password',
    mobilePhone: 'Mobile Phone',
    email: 'E-mail',
    verifyPhone: 'Phone Verification',
    verifyEmail: 'Email Verification',
    phoneText: 'Send Code',
    noInformationData: 'No Information Data',
    file: 'File',
    placeholder: {
      chose: 'Please select',
      username: 'Please input username',
      password: 'Please input password',
      mobilePhone: 'Please input mobile phone',
      email: 'Please input email',
      required: 'Please input',
      selectDate: 'Select Date'
    },
    validate: {
      password: 'The password must contain both uppercase letters, lowercase letters and numbers and symbols! The length of the password should be 8-16 digits.',
      mobilePhone: 'Incorrect format of mobile phone number',
      email: 'Incorrect format of Email',
      code: 'The verification code cannot be empty',
      verifyCodeRequired: 'Please input the verification code',
      sixCode: 'Incorrect format of verification code',
      wrongCode: 'Verification code is wrong',
      passwordTwice: 'Please input your password again',
      passwordDifferent: 'The new password is not the same as the confirmed password',
      required: 'Cannot be empty',
      postcode: 'Incorrect format of postcode',
      telephone: 'Incorrect format of telephone number',
      sName: 'Only support Chinese and English characters, numbers and special characters',
      userName: 'Only supports numbers and uppercase and lowercase letters',
      telephoneArea: 'Incorrect format of area code'
    },
    button: {
      confirm: 'Confirm',
      confirm2: 'Confirm',
      cancel: 'Cancel',
      forceLogin: 'Mandatory Login',
      lastStep: 'Previous',
      nextStep: 'Next',
      lastPage: 'Previous',
      nextPage: 'Next',
      submit: 'Submit',
      reset: 'Reset',
      copy: 'Copy',
      paste: 'Paste',
      oneClickClear: 'One-click Clear',
      expand: 'expand',
      collapse: 'collapse',
      pass: 'Pass',
      reject: 'Reject',
      goBack: 'Go Back',
      inquiry: 'Search',
      release: 'Release',
      download: 'Download',
      uploadFiles: 'Upload Files'
    },
    message: {
      sendSuccess: 'Send successfully',
      sendForeignSuccess: 'Please contact 4009787878-5 for your SMS verification code',
      submitSuccess: 'Submit successfully',
      tips: 'tips',
      usernameAndMobilePhone: 'Please input your username and mobile phone',
      usernameAndMail: 'Please input your username and email',
      selectItem: 'Please select a record',
      required: 'Cannot be empty',
      updateSuccess: 'Modified successfully'
    }
  },
  // 登录
  login: {
    title: 'User Login',
    login: 'Login',
    verifyType: 'Verification Code Channel',
    verifyCode: 'Verification Code',
    forgetPassword: 'Lost your password？',
    noAccountYet: 'Creat my account?',
    clickRegister: 'Click Register',
    loginTip: 'Please read "Personal Information Protection and Privacy Policy of CASS" and "User Agreement of CASS".',
    placeholder: {
      phoneCode: 'Please input SMS verification code',
      emailCode: 'Please input Email verification code'
    },
    validate: {
      username: 'Username cannot be empty',
      password: 'Password cannot be empty'
    },
    message: {
      otherDeviceToLogin: 'The user has logged in to another browser,mandatory login or not?',
      cancelLogin: 'Canceled login',
      changePassword: 'Please modify the initial password.',
      isvLogin: '是否以ISV身份登录进行服务申请？',
      yes: 'Yes',
      no: 'No'
    }
  },
  // 忘记密码
  forget: {
    retrievePassword: 'Forgot password',
    tip1: 'Please fill in the account where you want your password back',
    tip2: ' cell phone number or email address',
    modifyPassword: 'Modify Password',
    accountInfo: 'Your account is',
    newPassword: 'New Password',
    newPasswordConfirm: 'New Password Confirmation',
    placeholder: {
      sixCode: 'Please enter the 6-digit verification code'
    },
    message: {
      modifySuccess: 'Password modified successfully, please re-login',
      telephoneRequired: 'Please input your mobile phone number',
      telFormatError: 'Incorrect format of mobile phone number',
      emailRequired: 'Please input email',
      mailFormatError: 'Incorrect format of Email'
    }
  },
  // 注册
  register: {
    stepsList: ['Confirmation of terms of service', 'User Registration'],
    terms: 'Our organization has carefully read and understood the above terms and promises to abide by it.',
    dearUser: 'Dear User:',
    dearUserInfo: 'The registration function of the Interface service system is only open to the inter-bank market members, information providers, ISVs and other institutions that meet the requirements. After the registration of users, those who meet the registration requirements verified by the Interface Service system can obtain the corresponding permissions.Non-registered users can browse all public information of the Interface Service system.Click "Next Step" to complete the registration.',
    accountInfo: 'Account Information',
    passwordConfirm: 'Password Confirm',
    emailCode: 'Email Verification Code',
    phoneCode: 'SMS Verification Code',
    organizationInfo: 'Organization Information',
    organizationName: 'Institution Name',
    name: 'Name',
    telphone: 'Telephone',
    organizationIdentity: 'Institution Information',
    creditCode: 'Unified Social Credit Code',
    fileUpload: 'Upload Attachment',
    department: 'Department',
    userType: 'User Type',
    userRole: 'User Role',
    download: 'Download the template',
    tips: 'Please provide the following files: <br>1.The original photo or color scan of the ID card and the working permit (the original or copy file is acceptable) with an authorized stamp.<br>File Format:jpg,jpeg,png,pdf,no more than 10M.<br>2.If you are registered as an institution administrator user,you need to provide institution authorization document,you could click the"Download the Template"botton to download the authorization document template,fill in it and upload it with an authorized stamp',
    orgTip: 'If your institution name is not in the list, please contact the support team at 4009787878-5',
    message: {
      terms: 'Please select the terms of consent',
      registerSuccess: 'Register successfully'
    },
    validate: {
      username: 'Only Numbers and letters are supported for the username',
      mobilePhone: 'Support input up to 30 bytes',
      socialCode1: 'Please input the Unified Social credit code',
      socialCode2: 'Incorrect format of unified social credit code',
      file: 'Please upload the attachment.',
      organizationName: 'Please input the Institution Name',
      organizationIdentity: 'Please select  institution role'
    },
    placeholder: {
      keyWords: 'Please input keywords',
      areaCode: 'Area code',
      telNo: 'Please enter the telephone number.'
    },
    docName: 'Authorization Document Template.docx',
    labelWidth: '180px',
    left: '130px'
  },
  // 通知公告
  notice: {
    news: 'News',
    businessNotice: 'Business Notice',
    testNotice: 'Test Notice',
    placeholder: 'Please input keywords'
  },
  // 上传文件
  upload: {
    choseFile: 'Select the file',
    deleteTips: 'Press delete key to delete',
    message: {
      errorFileSizeTips: 'Upload failed.The file size can not exceed',
      errorFileTypeTips: 'Upload failed.The file type is not supported!',
      uploadSuccess: 'Upload successfully',
      uploadFail: 'Upload failed',
      downloadSuccess: 'Download successfully',
      downloadFail: 'Download failed!'
    }
  },
  // 头部
  header: {
    loginOrRegister: 'Please login or register first',
    organizationInfo: 'Institution Information',
    userManage: 'User Manage',
    personalCenter: 'Personal Center',
    exit: 'Logout'
  },
  // footer
  footer: {
    externalLinks: 'External Links',
    copyright: 'Copyright © China Foreign Exchange Trade System & National Interbank Funding Center.All Rights Reserved'
  },
  // 枚举值
  enum: {
    // 业务类型
    procTypeOptions: {
      newInterfaceApplication: 'New API Application',
      permissionChangeApplication: 'API Permission Change Application',
      interfaceTestingApplication: 'API Client Upgarde Testing Application'
    },
    // 服务类型
    serveiceOptions: {
      serviceOpening: 'API Service Opening',
      acceptanceTest: 'Certification Testing',
      interfaceOnline: 'Interface Go-live',
      permissionChange: 'Permission Change',
      networkOpeningApply: 'Network Activation Application'
    },
    // 我的服务-流程状态
    myServiceAuditStatusList: {
      pending: 'Pending Submission',
      review: 'Pending Review',
      reviewing: 'Reviewing',
      pass: 'Pass',
      withdraw: 'Withdraw',
      reject: 'Reject',
      pendingSubmission: 'Ceritification Testing Application Pending Review',
      standby: 'Standby',
      testing: 'Testing',
      ceritificationTestingApplicationReject: 'Ceritification Testing Application Reject',
      ceritificationTestingFailed: 'Ceritification Testing Failed',
      ceritificationTestingReportPendingReview: 'Ceritification Testing Report Pending Review',
      testingReportdownloadable: 'Ceritification Testing Success and Ceritification Testing Report Downloadable',
      ceritificationTestingReportReject: 'Ceritification Testing Report Reject',
      release: 'Release'
    },
    // 操作类型
    operationTypeOptions: {
      application: 'Application',
      edit: 'Edit',
      detail: 'Detail',
      audit: 'Review'
    }
  },
  // 首页
  home: {
    notice: 'Notice',
    standardsAndSpecifications: 'Standards and Specifications',
    more: 'More'
  },
  // 服务申请
  serviceApply: {
    applyImmediately: 'Apply Immediately',
    moreIntroduction: 'More Introduction',
    optional: 'Optional'
  },
  // 服务开通
  serviceOpening: {
    // index
    serviceNumber: 'Service Code',
    marketInstitutions: 'Market Members',
    informationVendors: 'Information Vendors',
    auditFeedback: 'Reviewing Feedback',
    contentDisplayedAfterAudit: '(After the audit, the content will be displayed to the organization)',
    backTo: 'Return to',
    requestForAccess: 'Request For API Service Content',
    basicInformation: 'Basic Information',
    selfConditionAssessment: 'Self-Condition Assessment',
    auditGoBack: 'Review Return To',
    // 申请权限
    requestedPermissionList: 'List of Requested Permissions',
    allCategories: 'All Catergories',
    market: 'Market',
    interfacePurpose: 'API Catalog',
    productCategories: 'Product Categories',
    message: {
      auditFeedbackRequired: 'Reviewing feedback cannot be empty',
      atLeastOneItemChecked: 'Please select at least one API'
    },
    // 服务申请-服务开通-基础信息
    institutionInfo: 'Institution Information',
    institutionFullName: 'Institution Full Name',
    institutionAddress: 'Institution Address',
    postcode: 'Postcode',
    businessContract: 'Business Contact',
    name: 'Name',
    department: 'Department',
    position: 'Position',
    telephone: 'Telephone',
    mobilePhone: 'Mobile Phone',
    fax: 'Fax',
    email: 'E-mail',
    standbyBusinessContract: 'Standby Business Contact',
    technicalContrct: 'Technical Contact',
    standbyTechnicalContract: 'Standby Technical Contact',
    informationVendorContact: 'Information Vendor Contact',
    interface: 'Interface Name',
    // 自身条件评估
    businessConditions: 'Business Conditions',
    isConnectWithFXTradingSystem: 'Is your network connected to the FX trading system?',
    isConnectWithRMBTradingSystem: 'Is your network connected to the RMB trading system?',
    isFXorMarketMakers: 'Is your institution a market maker in the FX market or Market Makers for Trial?',
    isBondMarketOrMarketMaker: 'Is your institution a market maker in the Bond market or Market Makers for Trial?',
    lastYearFxTransactionVolume: 'Transaction volume in FX market of last year',
    lastYearRMBTransactionVolume: 'Trading volume in RMB market of last year',
    isCompleteInfomationUsageSpe: 'Does your institution have complete information usage specifications?',
    isCompleteRiskManagerRules: 'Does your institution have a sound risk management rules and regulations?',
    isAbideByTradingRulesAndCorrTradingCodeOfConduct: 'Does your institution commit to abide by trading rules and corresponding trading code of conduct?',
    technicalConditions: 'Technical Conditions',
    whetherApplyingChineseRules: 'Whether the applying institution or its Independent Software Vendors conforms to the 《Management method for the CFETS Independent Software Vendors》?',
    technologyDevOrgName: 'Name of Independent Software Vendors',
    whetherApplyingBankRules: 'Whether the applying institution meets the requirements of the 《Technical Management Specifications for the Client of the Interbank Market Trading System》?',
    isLeasedLine: 'Is there a leased-line?',
    isBackupLeasedLine: 'Is there a backup leased-line?',
    noteUseLeasedLineConnectTradingCenter: 'Note: It is recommended to connect to CFETS through a leased line,otherwise there may be network transmission problems. If you have any problems, you can consult technical support team.',
    noteUseBackupLeaseLineConnectTradingCenter: 'Note: It is recommended to have a backup leased line, otherwise there may be network transmission problems. If you have any problems, you can consult technical support team',
    yes: 'Yes',
    no: 'No',
    note: {
      institutionType00Line1: '1.The business contact person should be the personnel of the   financial market department, custody department and other departments who directly   involved in the interbank market business of the applicant institution;',
      institutionType00Line2: '2.The technical contact person should be the technical   department personnel of the applicant institution, not the outsourced personnel;',
      institutionType00Line3: `3.Any change in the organization's basic information and   contact person, please modify the relevant information in the system in time.`,
      institutionType00Line4: '4.Business conditions consultation: FX Market: 4009787878-1-2/021-68797878-1-2; RMB Market: 4009787878-2-5',
      institutionType00Line5: '5.Technical consultation: 4009787878-5-1/021-58550738',
      institutionType10Line1: `1. Any change in the organization's basic information and contact person, please modify the relevant information in the system in time.`,
      institutionType10Line2: '2. Technical conditions consultation: 4009787878-5-2'
    },
    serviceOpeningAddSucceuss: 'API service opening submitted successfully',
    serviceOpeningUpdateSucceuss: 'API service opening modified successfully'
  },
  // 网络开通
  networkOpening: {
    marketMembers: 'Market Members',
    informationVendors: 'Information Vendors',
    interfaceName: 'Interface Name',
    submitter: 'Submitter',
    serviceCode: 'Service Code',
    serviceType: 'Service Type',
    processStatus: 'Process Status',
    approvalTime: 'Approval Time',
    name: 'Name',
    department: 'Department',
    mobilePhone: 'Mobile Phone',
    email: 'E-mail',
    serviceOpening: 'API Service Opening',
    permissionChange: 'Permission Change',
    button: {
      networkActivationApplication: 'Network Activation Application'
    },
    dialog: {
      sourceAddressPart1: 'Please add the outlet IP address of ',
      sourceAddressPart2: '. Note: it should start with 200~220 or 10.Please do not fill in other addresses.',
      sourceAddressPlaceholder: 'Please input the outlet IP address',
      whetherOpenNetwork: 'Whether the network is open',
      yes: 'Yes',
      no: 'No',
      serviceCode: 'Service Code',
      dimensionName: 'Interface Name',
      exportIPAddress: 'Outlet IP Address',
      targetAddress: 'Target Address',
      serviceContent: 'Service Content',
      backTo: 'Return to',
      auditGoBack: 'Review Return To',
      networkOpen: 'Network Activation ',
      titleStatus: {
        application: 'Application',
        edit: 'Edit',
        detail: 'Detail',
        audit: 'Review'
      }
    },
    class: 'network-opening en'
  },
  // 验收测试
  acceptanceTest: {
    dateValidate1: 'No time selected, please select time',
    dateValidate2: 'The selected time cannot be the same day and before the current day.',
    marketMembers: 'Market Members',
    informationVendors: 'Information Vendors',
    interfaceName: 'Interface Name',
    submitter: 'Submitter',
    serviceCode: 'Service Code',
    certificationTestApplication: 'Certification Testing Application',
    serviceType: 'Service Type',
    processStatus: 'Process Status',
    approvalTime: 'Approval Time',
    apiAccount: 'API Account',
    // 新接口申请-验收测试
    auditFeedback: 'Reviewing Feedback:',
    auditFeedbackMsg: '(After the audit, the content will be displayed to the organization)',
    testReportUpload: 'Test report upload:',
    testReportFileUploadTip: 'The upload file type is PDF,file size can not exceed 50MB.',
    alternateTipTitle: 'Notes on waitlist:',
    alternateTip: '1. If the institution has a normal available places within 7 working days when submitting the certification tetsing application form, in principle, the applictaion form in wait-listing will not be arranged.</br>2. Not all application form in wait-listing can be arranged for certifictaion testing. If no other institution cancels the certifictaion testing on the day, the application form in wait-listing cannot be arranged for certifictaion testing on the day.</br>We will contact you as soon as possible when you submit the application form to confirm the date when the certification testing can be arranged.',
    orgTip: 'It is recommended that the institution submit an certification testing application 7 working days in advance. Before applying, confirm that the firewall has been activated and the certification testing application form is filled in correctly to avoid affecting the subsequent testing.',
    button: {
      selectFiles: 'Select File',
      saveApplicationForm: 'Save',
      fileBtnName: 'Download Feedback Data Template',
      selectTestDate: 'Select Date',
      known: 'I have known'
    },
    message: {
      incomplete: 'Please upload the certification testing report first!',
      auditFeedbackRequired: 'Reviewing feedback cannot be empty',
      fileSizeLimit: 'Upload failed, The file size can not exceed 50MB',
      uploadSuccess: 'Upload successfully',
      downloadSuccess: 'Download successfully',
      downloadFail: 'Download failed',
      noticeContent: 'If your application contains multiple interface modules, you must complete multiple interface module tests at the same time within the time selected by the acceptance test. After all the interface modules have passed the acceptance test, you can get the final acceptance test report. If one of the modules is accepted Failure will affect the acceptance results of other modules, and the application form has up to three appeal opportunities. You can also choose different interface modules to submit acceptance applications separately. There are three appeal opportunities for each application form, and the acceptance test report of each interface module can be obtained separately. Please confirm again, thank you!',
      atLeastOneItemChecked: 'Please select at least one API',
      saveSuccess: `Saved successfully, please go to [My Service] to view the application form!`,
      duplicateRule1: 'Cannot be the same as serial number ',
      duplicateRule2: '', // 由于英语语序问题 第二部分为空
      sameTimeBeNoRule1: 'Can not be no at the same time with number ',
      sameTimeBeNoRule2: '', // 由于英语语序问题 第二部分为空
      notSupportChineseAndFullWidthChar: 'Chinese characters and full-width characters are not supported!',
      dateValidate1: 'Please choose a time',
      dateValidate2: 'The selected time cannot be the same day and before the current day.',
      dateValidate3: 'The current time is not selectable',
      dateValidate4: 'You can only book a date after the current day.',
      dateMustChangedManually: 'Testing time needs to be changed manually',
      mutexBefore: 'This operation will cancel the selection of ',
      mutexAfter: ', are you sure you want to continue?'
    },
    testReport: 'Testing Report:',
    backTo: 'Return to',
    requestForAccess: 'Request For API Service Content',
    selfCheckList: 'Check List',
    basicInformation: 'Basic Information',
    auditGoBack: 'Review Return to',
    // step1 申请权限
    requestedPermissionList: 'List of Requested Permissions',
    allCategories: 'All Catergories',
    market: 'Market',
    interfacePurpose: 'API Catalog',
    productCategories: 'Product Categories',
    // step2 自查清单
    currencyPair: 'Currency Pairs',
    currencyDialogDefaultTitle: 'Select Currency Pairs',
    inputDialogDefaultTitle: 'Input',
    // step3 基础信息
    institutionFullName: 'Institution Full Name',
    nameOfIndependentSoftwareVendors: 'Name of Independent Software Vendors',
    productVersion: 'Product Version',
    contractNameOfTest: 'Contact Name of test',
    certificationTestingType: 'Certification Testing Type',
    telephone: 'Telephone',
    mail: 'Email',
    mailNote: 'Contact Email of test (It shall be consistent with the registration email of EAATS certification testing system)',
    productionInterfaceAccount: 'API Account in Production Environment',
    acceptanceDate: 'Certification Testing Date',
    acceptanceTimeSelection: 'Select Certification Testing Date',
    full: 'Full',
    book: 'Available',
    reserve: 'Reserve',
    alternate: 'Waitlist',
    accpetor: 'Tester',
    selectAcceptor: 'Select',
    testingInterfaceAccount: 'API Account in Testing Environment',
    testerSelection: 'Tester Selection',
    newMember: 'New Member',
    permissionChange: 'Permission Change',
    versionUpgrade: 'Version Upgrade',
    backCalendar: 'Return Calendar',
    adept: 'Be proficient in',
    noInformation: 'No Information',
    evaluationScore: 'Evaluation Score',
    reservationAmount: 'Reservation Amount',
    score: 'Score'
  },
  // 接口上线
  interfaceOnline: {
    marketMembers: 'Market Members',
    informationVendors: 'Information Vendors',
    interfaceName: 'Interface Name',
    submitter: 'Submitter',
    serviceCode: 'Service Code',
    applicationForInterfaceGoLive: 'Application for Interface Go-live',
    serviceType: 'Service Type',
    processStatus: 'Process Status',
    approvalTime: 'Approval Time',
    apiAccount: 'API Account',
    apiAccountName: 'API Account Name',
    apiPassword: 'API Password',
    twentyOnedigitCode: '21 Digit Code',
    sixDigitCode: '6 Digit Code',
    fourDigitCode: '4 Digit Code',
    ipAdreessFirewallInfo: 'IP Address/Firewall Information',
    emergencyTechnicalContract: 'Emergency Technical Contact',
    name: 'Name',
    department: 'Department',
    position: 'Position',
    telephone: 'Telephone',
    mobilePhone: 'Mobile Phone',
    fax: 'Fax',
    email: 'E-mail',
    goLiveDate: 'Go-live Date',
    goLiveDateTooltip: 'When choosing a date, please allow time to prepare for the agreement terms and the export and stamping of the Go-live application form.',
    auditFeedback: 'Reviewing Feedback',
    auditFeedbackNote: '(After the audit, the content will be displayed to the institution)',
    backTo: 'Return to',
    auditGoBack: 'Review Return to',
    button: {
      saveApplicationForm: 'Save',
      previousPage: 'Previous'
    },
    message: {
      auditFeedbackRequired: 'Reviewing feedback cannot be empty',
      apiAccountNotBeDuplicate: 'The API account name cannot be duplicated',
      apiAccountCompleteConfirm: 'Please confirm that you have added API account information?',
      apiAccountIncomplete: 'API account information is not complete, please add it before submitting',
      atLeastOneItemChecked: 'Please select at least one API',
      atLeast21Digit: 'Must be 21 digits',
      atLeast6Digit: 'Must be 6 digits',
      atLeast4Digit: 'Must be 4 digits',
      dateValidate: 'The go-live date cannot be earlier than the current date',
      downloadSuccess: 'Download successfully',
      downloadFail: 'Download failed',
      fileTypeNotAccpeted: 'Upload failed. The file type is not supported',
      fileOversize: 'Upload failed, The file size can not exceed 50MB',
      uploadSuccess: 'Upload successfully',
      dataConfirm: 'Please make sure that the content filled in the application form is consistent with the attachment. If the information is inconsistent, the application form will be rejected by the reviewer',
      dataIncorrectNotice1: 'There is an error in the content you filled in, please modify and download!',
      dataIncorrectNotice2: 'There is an error in the content you filled in, please modify and submit!',
      dataIncorrectNotice3: 'There is an error in the content you filled in, please modify and submit!'
    },
    placeholder: {
      passwordNote: 'Please contact the support team for the password'
    },
    requestForAccess: 'Request For API Service Content',
    basicInformationAndDataUpload: 'Basic Information And Materials Upload',
    // 申请权限
    requestedPermissionList: 'List of Requested Permissions',
    newThisTime: 'This time added',
    thisCancellation: 'This time cancel',
    // 基础信息与材料上传
    institutionInfo: 'Institution Information',
    institutionFullName: 'Institution Full Name',
    interface: 'Interface Name',
    informationVendorContact: 'Information Vendor Contact',
    tradingCenterServerAddress: 'CFETS Service IP Address',
    servicePort: 'Service Port',
    remark: 'Remark',
    otherInfo: 'other information',
    internalVersionOfInstitution: 'Institutional Internal Interface System Version',
    clientIPAddress: 'Client IP Address',
    clientIPAddressTooltip: 'If the institution converts the source address assigned by the trading center to an internal NAT address, please fill in the source address assigned by CFETS. If you have any questions, please contact CFETS   Network Team : 4009787878-6-2',
    isLeasedLine: 'Is there a leased-line?',
    isBackupLeasedLine: 'Is there a backup leased-line?',
    basicInfoOfLeasedLine: 'Basic Information Of Leased Line',
    is: 'Network provider',
    telecom: 'CHINA TELECOM',
    unicom: 'CHINA UNICOM',
    mobile: 'CHINA MOBILE',
    other: 'Others',
    leasedLineCode: 'Leased-line Number',
    routerIPAddress: 'IP Address of Router Interface',
    bandwidth: 'Bandwidth',
    backupLeasedLineBasicInfo: 'Basic Information of Backup Leased-line ',
    backupLeasedLineCode: 'Backup leased-line Number',
    uploadAgreementTerms: 'Upload Agreement Terms',
    uploadAgreementTermsTooltip: 'Please download the following materials, upload after stamping and mail the paper version of the agreement to CFETS.',
    agreementTermsUpload: 'Upload Agreement Terms',
    agreementTermsUploadTooltip: 'Please upload the corresponding agreement terms document of the applied api with an authorized stamp.File Format:pdf,no more than 50M.',
    alreadySigned: 'Already Signed',
    alreadyApplied: 'Already Applied',
    agreementTerm: 'Agreement Terms',
    applicationTemplateOfDigitalCertificate: 'Digital Certificate Application Form',
    applicationTemplateOfDigitalCertificateTooltip: 'Please download the following materials, upload after stamping and mail the paper version of the agreement to CFETS.',
    uploadAppTempOfDigitalCert: 'Upload Digital Certificate Application Form',
    uploadAppTempOfDigitalCertTooltip: 'Please upload the digital certificate application form of the applied api with an authorized stamp.File Format:pdf,no more than 50M.',
    fieldServiceFeedback: 'Field service feedback',
    fieldServiceFeedbackTooltip: 'If you need to feedback multiple API accounts, please click the button to add.',
    addAPIAccount: 'Add API Account',
    businessDeptEnter: '(Fill in by business department)',
    passwordContactFeildService: 'Please contact the support team for the password',
    operation: 'Operation',
    materialsUpload: 'Upload Materials',
    materialsUploadTooltip: 'Please make sure that all the form information has been filled in.',
    onlineApplicationForm: 'Go-live Application Form',
    onlineApplicationForm2: ', upload after stamping',
    uploadNote1: 'Please upload the following documents:',
    uploadNote2: '1.Application form for Go-live',
    uploadNote3: '2.Cetification Testing Report',
    uploadNote4: '(① If the default service content is partially ticked in the certification testing application form, the  certification testing report shall be exported and the reason for the partically ticked shall be supplemented; ② If all the default service content are ticked, there is no need to export and upload ceritification testing report with instructions)',
    yes: 'Yes',
    no: 'No',
    // 打印
    interfaceOnlineAppForm: 'Interface Go-live Application Form',
    leasedLineServiceProviderName: 'Network provider',
    seal: 'Stamp',
    date: 'Date'
  },
  // 权限变更
  permissionChange: {
    marketMembers: 'Market Members',
    informationVendors: 'Information Vendors',
    interfaceName: 'Interface Name',
    submitter: 'Submitter',
    apiAccount: 'API Account',
    goLiveTime: 'Go-live Time',
    button: {
      applicationPermissionChange: 'Application for permission change',
      pass: 'Pass',
      reject: 'Reject',
      goBack: 'Return',
      stillApply: 'Still Apply'
    },
    requestForAccess: 'Request For API Service Content',
    basicInformation: 'Basic Information',
    serviceNumber: 'Service Code',
    auditFeedback: 'Reviewing Feedback',
    contentDisplayedAfterAudit: '(After the audit, the content will be displayed to the organization)',
    backTo: 'Return to',
    message: {
      auditFeedbackRequired: 'Reviewing feedback cannot be empty'
    },
    auditGoBack: 'Review Return To',
    newAdd: 'This time added',
    newCancle: 'This time cancel',
    institutionInfo: 'Institution Information',
    institutionFullName: 'Institution Full Name',
    institutionAddress: 'Institution Address',
    postcode: 'Postcode',
    contract: 'Contact',
    name: 'Name',
    department: 'Department',
    position: 'Position',
    telephone: 'Telephone',
    mobilePhone: 'Mobile Phone',
    fax: 'Fax',
    email: 'E-mail',
    labelWidth: '110px'
  },
  // 我的服务
  myService: {
    marketMembers: 'Market Members',
    informationVendors: 'Information Vendors',
    interfaceName: 'Interface Name',
    businessType: 'Business Type',
    serviceType: 'Service Type',
    processStatus: 'Process Status',
    serviceCode: 'Service Code',
    submitter: 'Submitter',
    submitTime: 'Submit Time',
    tip: 'Note: The current list is calculated based on the number of main application forms.',
    placeholder: {
      all: '--All--',
      startTime: '--Start Time--',
      endTime: '--End Time--',
      rangeSeparator: 'to'
    },
    processView: 'Process View',
    operation: 'Operation',
    button: {
      view: 'View',
      edit: 'Edit',
      withdraw: 'Withdraw',
      delete: 'Delete',
      print: 'Print',
      acceptanceTest: 'Certification Testing',
      interfaceOnline: 'Interface Go-live',
      testInfo: 'Test Information'
    },
    dialog: {
      title: 'Test Information Feedback',
      title1: 'Satisfaction Survey',
      placeholder: 'Required',
      processView: {
        auditDetails: 'Reviewing Details',
        auditFeedback: 'Reviewing Feedback',
        departAudit: 'Department to be reviewed',
        pendingAuditor: 'Pending Reviewer',
        reviewer: 'Reviewer',
        name: 'Name',
        concatInfo: 'Contact Information',
        applStatus: 'Application Form Status',
        AcceptApplFormName: 'Ceritification Testing Application Name',
        dept: 'Department',
        auditStatus: 'Reviewing Status',
        auditTime: 'Reviewing Time'
      }
    },
    alert: {
      title1: 'The API product has been updated. If you need to apply for a new API service, please select the corresponding process in the [API Service] to resubmit',
      title2: 'Please confirm whether to withdraw this process?',
      title3: 'Please confirm whether to delete this process?'
    },
    message: {
      msg1: 'This process has been cancelled',
      msg2: 'This process has been deleted',
      addScore: 'Successful evaluation',
      required: 'You have not filled in the remarks',
      required1: 'You have not completed the required items'
    },
    labelWidth: '110px',
    statusMinWidth: '140',
    processWidth: '120',
    operationWidth: '320'
  },
  // 用户中心
  userCenter: {
    nameAndTelephone: 'Name, Telephone',
    set: 'Set up',
    collapse: 'Fold',
    edit: 'Edit',
    bindMobilePhoneNumber: 'Bind mobile phone number',
    bound: 'Binding completed',
    bindEmail: 'Bind mailbox',
    fullName: 'Name',
    landline: 'Telephone',
    enterNumber: 'Please input the telephone number',
    areaCode: 'Area Code',
    message: {
      nameRequired: 'Name cannot be empty',
      formatValidate: 'Only support Chinese and English characters, numbers and special characters',
      enterAreaCode: 'Please input the area code',
      areaCodeFormatError: 'Incorrect format of area code',
      passwordRequired: 'Please input password',
      newPasswordFormat: 'The password must contain both uppercase letters, lowercase letters and numbers and symbols! The length of the password should be 8-16 digits.',
      enterPasswordAgain: 'Please enter the password again',
      passwordInconsistent: 'The new password is not the same as the confirmed password.',
      orginalPasswordRequired: 'Original password cannot be empty',
      newPasswordRequired: 'New password cannot be empty',
      passwordUpdateSuccess: 'Password modified successfully',
      telephoneRequired: 'Please input your mobile phone number',
      telFormatError: 'Incorrect format of mobile phone number',
      emailRequired: 'Please input email',
      mailFormatError: 'Incorrect format of Email'
    },
    originalPassword: 'Original Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm Password',
    placeholder: {
      newPassword: 'The password must contain both uppercase letters, lowercase letters and numbers and symbols! The length of the password should be 8-16 digits.',
      sixCode: 'Please enter the 6-digit verification code'
    },
    SMSVerifyCode: 'SMS verification code',
    emailCode: 'Email verification code'
  }
}
