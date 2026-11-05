FROM postgres:18-alpine
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Africa/Douala /etc/localtime \
    && echo Africa/Douala > /etc/timezone
ENV TZ=Africa/Douala
COPY backup.sh /usr/local/bin/backup.sh
COPY schedule.sh /usr/local/bin/schedule.sh
RUN chmod 755 /usr/local/bin/backup.sh /usr/local/bin/schedule.sh \
    && echo '30 2 * * * /usr/local/bin/backup.sh > /proc/1/fd/1 2> /proc/1/fd/2' > /etc/crontabs/root
USER root
ENTRYPOINT ["/usr/local/bin/schedule.sh"]
