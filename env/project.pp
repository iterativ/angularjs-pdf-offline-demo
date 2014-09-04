# packages install
class {'djserver':
}

# base dependencies
$base_libs = ['libjpeg62', 'libjpeg62-dev', 'libfreetype6',
              'libfreetype6-dev', 'libpcre3-dev', 'zlib1g-dev',
              'libxml2', 'libxml2-dev', 'libssl-dev']

# django server dependencies
package { $base_libs:
    ensure => installed,
    require => Class['djserver']
}
