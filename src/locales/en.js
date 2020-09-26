const Strings = {
    auth: {
        loading: 'Loading af',
    },
    beacons: {
        lastReceived: 'Latest beacon',
        notYetReceived: 'Ready for beacons',
    },
    contacts: {
        add: {
            title: 'Choose your Crew',
        },
        chooseInstruction: {
            start: 'You have',
            end:
                'of 5 possible people in your crew. Adjust your crew by pressing names shown below.',
        },
        choosePrompt:
            'Choose up to 5 contacts by pressing their names. These are the people we will reach out to when you ' +
            'send a message.',
        crewNamePlaceholder: 'My Crew',
    },
    crewEventTimeline: {
        headings: {
            cancel: '🚫 You canceled the message.',
            create: '📣 You started a message.',
            join: 'is available.',
            notify: '💌 We reached out to ',
            expire: 'Your message expired.',
            unknown: '🤮 Something got mixed up on our end',
        },
        title: {
            crew: 'You held down the button so we reached out to your crew.',
            ems:
                'You held down the button so we reached out to 911 dispatchers.',
            crewAndEms:
                'You held down the button so we reached out to your crew and 911 dispatchers.',
        },
    },
    feature911: {
        main: {
            title: 'How Flare Works With 911',
            subtext: `Flare will send your GPS location to 911 and your Crew—even if you don’t know where you are or can’t speak.\nThe dispatcher will be able to view your live location on their screen.`,
        },
        textAndCall: {
            title: `A Text, And\n A Call`,
            subtext:
                'The dispatcher will text and call you within 60 seconds to confirm your safety. If you are able to text or talk you can communicate directly with them until help arrives.',
        },
        talkToDispatchers: {
            title: `Talk Directly To\nDispatchers`,
            subtext:
                'If it was an accidental activation of the 911 feature, you can easily cancel the alarm by responding to the dispatcher.',
            message1:
                'Hi, this is Nikki from Noonlight. We received an alarm from your Flare device. What is your emergency?',
            message2:
                'I’m just testing my Flare bracelet, no problem here. Thanks!',
            message3: 'Great. Glad you are safe. Have a good night.',
        },
        success: {
            title: 'Success',
            subtext:
                'We encourage you to test the 911 feature! Since we go through a third party, there is no need to worry about taking up emergency service resources.',
            tryBtnText: 'GIVE IT A TRY',
            notNowBtnText: 'NOT NOW',
        },
        readyToTest: {
            title: `Ready to Test It?`,
            subtext:
                'Hold the button on your cuff for 3 seconds and release it. A representative from Noonlight will text you and call you. Noonlight is an intermediary who will then reach out to 911 dispatchers, so you don’t have to worry about tying up valuable resources. Be sure to indicate that you are safe and testing your Flare bracelet.',
        },
        gotYourBack: {
            title: `We’ve Got Your\n Back.`,
            subtext:
                'If you have a Crew, they will still be notified that you are in a situation.',
            enableBtnText: 'ENABLE 911',
            notNowBtnText: 'NOT NOW',
        },
        crewWillKnow: {
            title: `Your Crew Will\n Know, Too`,
            subtext:
                'If you have a Crew, they will be still notified that you are in a situation.',
        },
    },
    dev: {
        sendTestFlare: 'Flare',
        sendTestCall: 'Call',
        sendTestCheckin: 'Checkin',
    },
    deviceSelector: {
        enterDeviceCodePrompt: 'Enter the code printed on your jewelry',
        errorAddingDevice: 'Please enter a valid code',
    },
    generic: {
        idPrefix: '#',
        signOut: 'Sign Out',
        confirm: 'Yeah',
        cancel: 'Cancel',
    },
    home: {
        bluetoothDisabledWarning: 'Turn bluetooth on in your phone settings',
        locationDisabledWarning:
            'Set location permission to Always in phone settings',
        cancelActiveFlare: 'I’m Okay',
        chooseLanguage: 'Choose language',
        contactsButtonLabelAdd: 'Choose Your Crew',
        contactsButtonLabelEdit: 'Edit Your Crew',
        contactsNeedPermission: 'Enable contacts access in phone settings',
        lastBeacon: {
            absent: 'Ready for beacons',
            present: 'Last beacon received',
        },
        title: 'Welcome',
    },
    jewelry: {
        addNew: 'Add new jewelry',
        addNewAuto: {
            prompt:
                'Please press the button on your new jewelry 3 times in a row.',
        },
        addNewConfirm: {
            fccMessage: 'CONTAINS FCC ID: RYYEYSLSN',
            placeholderTwoFactor: 'Last 3 digits',
            prompt:
                'Got it! Please look at the bottom of your jewelry and type the last 3 digits of the code you see.',
            sampleDigits: '???',
            secondFactorError: 'Wrong code? Please try again.',
        },
        addNewManual: {
            buttonLabel: 'Add Manually',
            cameraPermissionMessage:
                'Please let us use your camera so we can scan your jewelry',
            cameraPermissionTitle: 'Permission to use camera',
            placeholderDeviceID: 'Jewelry code, eg XXX123',
            prompt:
                'Please point your camera at the QR code on the bottom of your jewelry. ' +
                'If you prefer, type the jewelry code into the field below.',
        },
        addNewTryAgain: 'Start over',
        addThisButtonLabel: 'Add this Jewelry',
        cuffV1: {
            name: 'Flare Prototype',
        },
        cuffV2: {
            name: 'Flare Cuff',
        },
        cuffV3: {
            name: 'Flare Cuff',
        },
        emptyList:
            "You don't have any jewelry. Press the Add New button to add jewelry to your account",
        remove: 'Remove from account',
        removeConfirm: {
            cancelLabel: 'No, keep it',
            confirmLabel: 'Yes, remove it',
            promptBegin: 'After you remove the jewelry with label ',
            promptEnd:
                ", pressing its button won't do anything. " +
                ' You will not get calls and your crew will not receive messages.\n\n' +
                'Are you sure you want to remove it?',
        },
    },
    leftDrawer: {
        ambassador: 'Become an ambassador',
        home: 'Home',
        jewelry: 'Jewelry',
        settings: 'Settings',
    },
    manufacturing: {
        title: 'Device Provisioning',
        /* Stages -- must match server enum */
        stages: {
            New: 'New',
            Added: 'Added',
            BurnIn: 'Burn In',
            Ready: 'Ready',
        },
        testBeacon: 'Test',
    },
    notifications: {
        bluetoothDisabled:
            'Please turn on bluetooth so that Flare can work! 💔',
        title: 'Reminder',
        events: {
            flare: {
                defaultMessage: 'Get that thing done',
            },
        },
        noCrew: {
            title: 'You Need a Crew',
            message:
                "Flare could not send out a message because you haven't added contacts to your Crew yet. Add them now!",
        },
    },
    onboarding: {
        signupButton: 'Sign up',
        skipConfirmPrompt:
            "Are you sure you want to skip onboarding? The app basically won't work",
        welcome: {
            title: 'Welcome!',
            subtitle:
                "We're so excited that you've joined. Flare exists so that you don't have to make compromises " +
                'for your safety.',
            alwaysAllow: 'Always allow',
            buttonLabel: 'Get Started',
            locationAlreadyPrompted:
                'Set location permission to Always in phone settings so your jewelry can work.',
            proceedAnywayButtonLabel: 'No thanks, proceed anyway',
        },
        location: {
            subtitle:
                'Flare needs permission to access your location so that we can let your friends know when and ' +
                'where you need backup. Select "Always Allow" so it will work even when the app isn\'t open.',
        },
        noBluetooth: {
            title: 'Enable Bluetooth',
            subtitle: 'Please enable Bluetooth before using your jewelry.',
        },
        shortPress: {
            title: 'Short Press',
            subtitle:
                "Press once and release the button on your bracelet to activate the phone call feature. You'll " +
                'feel a click. Answer the call!',
            singleDevice: {
                title: 'Short Press',
                subtitleStart:
                    'Great. You can use the call as an excuse to exit gracefully.',
            },
            disabled: {
                subtitle:
                    'Give us location permission so you can use your jewelry.',
            },
            proceedAnywayButtonLabel: "I don't want a call right now",
            proceedLabel: 'Show me more!',
        },
        longPress: {
            waiting: {
                title: 'Long Press',
                subtitle:
                    'Now hold the button down for longer, about 3 seconds, and let go.',
            },
            success: {
                title: 'Sweet!',
                subtitle:
                    "Normally we'd reach out to your friends now. They'd know where you are and how to reach you.",
            },
            disabled: {
                subtitle:
                    'Without location privileges you will not be able to use your jewelry. Please go to ' +
                    'your phone settings and set location access to Always.',
            },
            proceedAnywayButtonLabel: 'No thanks, proceed anyway',
            proceedButtonLabel: "Awesome. What's next?",
        },
        longPressCancel: {
            initial: {
                subtitle:
                    "Choose a 4 digit pin code that you'll enter to cancel messages in the future.",
                buttonLabel: 'Save Secret',
            },
            hasSetPin: {
                title: 'Nice.',
                subtitle:
                    'You canceled your message, so your friends know the situation is resolved.',
                buttonLabel: 'Keep going',
            },
            pinPlaceholder: 'Secret pin',
            pinConfirmPlaceholder: 'Confirm secret pin',
            errors: {
                tooShort: 'PIN must be 4 digits',
                mismatch: 'PIN and confirmation must match',
            },
        },
        notifications: {
            subtitle:
                "When you hold the button, how will you know that your message went out? We'll send you a coded " +
                'pop-up notification with a secret phrase. We need permission to send you the notification.',
            buttonLabel: 'Allow',
            disabled: {
                subtitle: 'Turn notifications on in your phone settings',
                buttonLabel: 'Proceed anyway',
            },
        },
        flareExample: {
            story: {
                flareName: 'Flare: ',
                first:
                    'Your selected contacts will get a group text message with your location. We ask them to give ' +
                    'you a call and check-in.',
                second:
                    "You'll be able to see a transcript of their conversation in the app.",
                third: 'Press the Cancel button below to end this message.',
            },
            buttonLabel: 'Cancel',
            locationDisabled:
                'This is the screen you see after you hold the button on your jewelry to send a message.',
        },
        contacts: {
            hasCrew: {
                buttonLabel: "Let's Go",
                subtitle: "You're ready to use Flare.",
                title: 'All set!',
            },
            hasPermission: {
                chooseCrewLabel: 'Choose Crew',
                subtitle:
                    'Press the button below to choose the contacts you want to reach with Flare.',
                title: 'Choose Your Crew',
            },
            initial: {
                buttonLabel: 'Give Access',
                subtitle:
                    'We need permission to access your contacts so that you can select the friends we message.',
                title: 'Contacts',
            },
            overlay: {
                instructions:
                    'Click on the name of a contact to add them to your crew.',
                title: 'Choose up to 5 contacts.',
                closeButtonLabel: 'Save Crew',
            },
            disabled: {
                subtitle: 'Turn contacts on in your phone settings',
                buttonLabel: 'Proceed anyway',
            },
        },
    },
    permissions: {
        coarseLocation: {
            message:
                'Please give Flare permission to use your location. We only share your ' +
                'location with your selected contacts when you need backup.',
            title: 'Flare wants your general location',
        },
        contacts: {
            message:
                'Please give Flare permission to read your contacts. We display your ' +
                'contacts so that you can choose your crew.',
            title: 'Flare wants to read your contacts',
        },
        fineLocation: {
            message:
                'Please give Flare permission to use your location. We only share ' +
                'your location with your selected contacts when you need backup.',
            title: 'Flare wants your precise location',
        },
    },
    pin: {
        failure: 'Invalid PIN',
        prompt: 'Enter your PIN',
        title: 'Cancel Message',
        neverMind: 'Never Mind',
        error: 'Invalid PIN code',
    },
    settings: {
        call: {
            details:
                'Choose the message that you hear when you press the button and we call you.',
            title: 'Phone call script',
            saveButtonLabel: 'Use script',
            scripts: {
                roomMateFemale: 'Roommate needs help (female)',
                roomMateMale: 'Roommate needs help (male)',
            },
        },
        config: {
            title: 'Support info',
        },
        sections: {
            account: {
                title: 'Account',
                links: {
                    privacy: 'Privacy',
                    notifications: 'Notifications',
                    call: 'Phone call script',
                },
            },
            diagnostics: {
                title: 'Diagnostics',
                links: {
                    config: 'Support info',
                },
            },
        },
        notifications: {
            customOption: 'Custom',
            customPromptPlaceholder: 'Your code phrase',
            defaultMessage: 'You sent a message to your crew 💫',
            defaultOption: 'Default',
            promptSelectionBody:
                "You'll get a notification with this message when you press and hold the button on your jewelry. " +
                'When it pops up, you know that we messaged your crew.',
            promptSelectionTitle: 'Custom notification',
            saveButtonLabel: 'Save popup',
            title: 'Notification',
        },
        privacy: {
            title: 'Privacy',
            analytics: {
                prompt: 'Send analytics data to Flare',
                details:
                    'Flare uses analytics to improve and develop new features to help our members navigate the world ' +
                    'around them with more confidence and control. We take privacy seriously and will not share ' +
                    'identifying data.',
            },
        },
        title: 'Settings',
        titlePrefix: 'Settings: ',
    },
    register: {
        instructions:
            'Hey, congrats on getting your Flare! Fill this out to create your account. You need the code written ' +
            'on the sticker we put on your jewelry.',
        phonePrompt: 'Phone number – no dashes',
        emailPrompt: 'Email – you@domain.com',
        confirmPasswordPrompt: 'Confirm Password',
        serialNumber: 'Jewelry Serial Number – XXXYYYZZZ',
        needToBuy: 'I need to buy jewelry',
        submitLabel: 'Create New Account',
        errors: {
            allFieldsRequired: 'All fields are required.',
            invalidSerialNumber: 'Please enter a valid serial number.',
            serverError: 'Something went wrong. Please try again later.',
        },
    },
    register2: {
        instructions:
            'Almost done! Please enter your name and password to start using your jewelry.',
        firstNamePrompt: 'First name',
        lastNamePrompt: 'Last name',
        passwordPrompt: 'Password',
        submitLabel: "Let's do this!",
        errors: {
            invalidPassword:
                'Passwords need to be 8 characters or more. Use letters, numbers, and punctuation.',
        },
    },
    signin: {
        forgotPassword: 'Forgot Password?',
        invalid: 'Please enter a valid username and password.',
        passwordPrompt: 'Password',
        register: 'Create New Account',
        signInLabel: 'Sign In',
        usernamePrompt: 'Email',
        warning: 'You need to sign in so Flare can work! 🔥',
    },
};

export default Strings;
