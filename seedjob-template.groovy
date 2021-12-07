job('Job Completed Test') {
    steps {
        shell('echo Hello World!')
    }

    configure {
        it / 'properties' / 'com.tikal.hudson.plugins.notification.HudsonNotificationProperty' {
            properties('plugin=notification@1.15')
            endpoints {
                'com.tikal.hudson.plugins.notification.Endpoint' {
                    'timeout'('30000')
                    'format'('JSON')
                    'protocol'('HTTP')
                    urlInfo {
                        'urlOrId'('WEBHOOK_URL')
                        'urlType'('PUBLIC')
                    }
                }
            }

        }
    }
}

job('Job Failed Test') {
    steps {
        shell("exit 1")
    }

    configure {
        it / 'properties' / 'com.tikal.hudson.plugins.notification.HudsonNotificationProperty' {
            properties('plugin=notification@1.15')
            endpoints {
                'com.tikal.hudson.plugins.notification.Endpoint' {
                    'timeout'('30000')
                    'format'('JSON')
                    'protocol'('HTTP')
                    urlInfo {
                        'urlOrId'('WEBHOOK_URL')
                        'urlType'('PUBLIC')
                    }
                }
            }

        }
    }
}