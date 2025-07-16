for file in $(find src -type f ! -path "*/dist/*"; echo index.html);
  do    echo "===== $file =====";
        cat "$file";
        echo "";
  done
