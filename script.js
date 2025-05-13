    const form = document.getElementById('journal-form');
    const moodInput = document.getElementById('mood');
    const noteInput = document.getElementById('note');
    const entriesContainer = document.getElementById('entries');
    const moodChartCtx = document.getElementById('moodChart').getContext('2d');

    let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];

    function updateLocalStorage() {
      localStorage.setItem('moodEntries', JSON.stringify(entries));
    }

    function renderEntries() {
      entriesContainer.innerHTML = '';
      entries.slice().reverse().forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `<strong>${entry.date} - ${entry.mood}</strong><br>${entry.note}`;
        entriesContainer.appendChild(div);
      });
    }

    function renderChart() {
      const moodCounts = {};
      entries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });

      const labels = Object.keys(moodCounts);
      const data = Object.values(moodCounts);

      if (window.moodChart) window.moodChart.destroy();

      window.moodChart = new Chart(moodChartCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Mood Frequency',
            data,
            backgroundColor: '#4a90e2',
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `${context.label}: ${context.parsed.y} days`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Days Logged'
              }
            }
          }
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const mood = moodInput.value;
      const note = noteInput.value.trim();

      if (!mood || !note) {
        alert('Please fill in both mood and note.');
        return;
      }

      const entry = {
        date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
        mood,
        note
      };

      entries.push(entry);
      updateLocalStorage();
      renderEntries();
      renderChart();

      form.reset();
    });

    renderEntries();
    renderChart();
